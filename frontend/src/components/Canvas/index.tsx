import { DndContext, useDraggable } from "@dnd-kit/core";
import { useState, useRef, forwardRef, useContext, useEffect } from "react";
import styles from "./Canvas.module.css";
import Roll from "../../functions";
import Notification from "../Notification";
import { AppContext } from "../../contexts/AppContext";
import D20 from "../../assets/d20";
import { CampoData } from "../../Interfaces";

export default function Canvas({
  campos,
  setCampos,
  setCampoSelecionado,
  campoSelecionado,
  setErro,
  onHeightChange,
  style,
}: {
  campos: CampoData[];
  setCampos: (campos: CampoData[]) => void;
  setCampoSelecionado: (campoSelecionado: CampoData | undefined) => void;
  campoSelecionado: CampoData | undefined;
  setErro: (erro: string) => void;
  onHeightChange?: (height: number) => void;
  style: React.CSSProperties;
}) {
  const campoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | string>("100%");
  const initialPixelHeightRef = useRef<number | null>(null);

  const { setNotificationText, setNotificationSubText, setNotificationTitle } =
    useContext(AppContext);

  useEffect(() => {
    if (canvasRef.current && initialPixelHeightRef.current === null) {
      initialPixelHeightRef.current = canvasRef.current.offsetHeight;
    }
  }, []);
  useEffect(() => {
    if (canvasRef.current && onHeightChange) {
      const height = canvasRef.current.offsetHeight;
      onHeightChange(height);
    }
  }, [canvasHeight]);

  function handleDragMove(event: any) {
    const { delta } = event;

    if (
      campoSelecionado &&
      canvasRef.current &&
      campoRefs.current[campoSelecionado.id]
    ) {
      const draggedCampoElement = campoRefs.current[campoSelecionado.id];
      if (!draggedCampoElement) return;

      const potentialY = campoSelecionado.y + delta.y;
      const campoHeight = draggedCampoElement.offsetHeight;
      const requiredHeight = potentialY + campoHeight + 50;
      const currentPixelHeight = canvasRef.current.offsetHeight;

      if (requiredHeight > currentPixelHeight) {
        setCanvasHeight(requiredHeight);
      }
    }
  }

  function handleDragEnd(event: any) {
    const { active, delta } = event;
    const draggedCampo = campos.find((c) => c.id === active.id);
    if (!draggedCampo || !canvasRef.current) return;

    const draggedElement = campoRefs.current[draggedCampo.id];
    if (!draggedElement) return;

    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeightCurrent = canvasRef.current.offsetHeight;
    const campoWidth = draggedElement.offsetWidth;
    const campoHeight = draggedElement.offsetHeight;

    // Calcula nova posição limitada dentro do canvas
    let newX = draggedCampo.x + delta.x;
    let newY = draggedCampo.y + delta.y;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + campoWidth > canvasWidth) newX = canvasWidth - campoWidth;
    if (newY + campoHeight > canvasHeightCurrent)
      newY = canvasHeightCurrent - campoHeight;

    const nextCampos = campos.map((c) =>
      c.id === active.id ? { ...c, x: newX, y: newY } : c
    );

    // Atualiza altura do canvas se necessário
    const contentMaxY = Math.max(
      ...nextCampos.map((c) => {
        const el = campoRefs.current[c.id];
        return el ? c.y + el.offsetHeight : 0;
      })
    );
    const requiredContentHeight = contentMaxY + 50;
    const initialHeight = initialPixelHeightRef.current;

    if (initialHeight && requiredContentHeight <= initialHeight) {
      setCanvasHeight("100%");
    } else {
      setCanvasHeight(requiredContentHeight);
    }

    setCampos(nextCampos);
  }

  function handleInputChange(id: string, valor: string) {
    setCampos(campos.map((x) => (x.id == id ? { ...x, value: valor } : x)));
  }

  function handleDragStart(event: any) {
    setCampoSelecionado(campos.find((c) => c.id === event.active.id));
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        canvasRef.current &&
        canvasRef.current.contains(event.target as Node)
      ) {
        const clickedOnCampo = Object.values(campoRefs.current).some(
          (campo) => campo && campo.contains(event.target as Node)
        );

        if (!clickedOnCampo) {
          setCampoSelecionado(undefined);
          setErro("");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Notification />
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
      >
        <div
          ref={canvasRef}
          className={styles.canvasArea}
          style={{
            ...{
              height:
                typeof canvasHeight === "string"
                  ? canvasHeight
                  : `${canvasHeight}px`,
            },
            ...style,
          }}
        >
          {campos.map((campo) => (
            <Campo
              key={campo.id}
              {...campo}
              ref={(el: any) => (campoRefs.current[campo.id] = el)}
              Roll={(macro, label) =>
                Roll(
                  macro,
                  campos as { id: string; value: string }[],
                  setNotificationText,
                  setNotificationSubText,
                  setNotificationTitle,
                  label
                )
              }
              onChange={handleInputChange}
              onSelectCampo={(id: string) =>
                setCampoSelecionado(campos.find((c) => c.id === id))
              }
              idCampo={campoSelecionado?.id ?? ""}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}

interface CampoProps extends CampoData {
  Roll: (macro: string, label?: string) => void;
  onChange: (id: string, valor: string) => void;
  onSelectCampo: (id: string) => void;
  idCampo: string;
}

const Campo = forwardRef<HTMLDivElement, CampoProps>(function Campo(
  {
    id,
    x,
    y,
    title,
    inputType,
    placeholder,
    macro,
    Roll,
    value,
    onChange,
    onSelectCampo,
    idCampo,
    selectOptions,
    corFundo,
    corBorda,
    corTexto,
    corTextoSelected,
    semFundo,
    corFundoInput,
    corTextoInput,
    inputSemFundo,
    imagem,
    tamanhoImagem,
    layer
  },
  ref
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const finalX = x + (transform?.x ?? 0);
  const finalY = y + (transform?.y ?? 0);
  const isDragging = transform !== null;

  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (ref) {
      if (typeof ref === "function") ref(node);
      else
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(20);

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 12);
    }
  }, [value, placeholder]);

  return (
    <div
      ref={combinedRef}
      className={styles.campo}
      style={{
        transform: `translate(${finalX}px, ${finalY}px)`,
        position: "absolute",
        transition: transform ? "none" : "transform 200ms ease",
        filter: isDragging ? "brightness(1.25)" : "brightness(1)",
        boxShadow: isDragging ? "0 0 10px rgba(0,0,0,0.3)" : "none",
        display: "flex",
        alignItems: "center",
        zIndex: layer,
        ...(idCampo == id
          ? {
              border:
                "5px solid " +
                (semFundo ? "transparent" : corFundo ?? "var(--Secundaria)"),
              backgroundColor: semFundo
                ? "transparent"
                : corBorda ?? "var(--Primaria)",
              color: corTextoSelected ?? "white",
            }
          : {
              border:
                "5px solid " +
                (semFundo ? "transparent" : corBorda ?? "var(--Primaria)"),
              backgroundColor: semFundo
                ? "transparent"
                : corFundo ?? "var(--Secundaria)",
              color: corTexto ?? "black",
            }),
      }}
      onClick={() => onSelectCampo(id)}
    >
      <div
        {...listeners}
        {...attributes}
        className={styles.dragHandle}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          ...(idCampo == id
            ? { color: semFundo ? corTextoSelected : corFundo ?? "var(--Secundaria)" }
            : {
                color: semFundo
                  ? corTexto
                  : corBorda ?? "var(--Primaria)",
              }),
        }}
      >
        ⠿
      </div>

      <div
        className={styles.content}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {title && (
          <label style={{ marginRight: 10 }} htmlFor={id}>
            {title}
            {inputType != "header" && ":"}
          </label>
        )}
        {inputType === "number" && (
          <div>
            <input
              type="number"
              name={id}
              id={id}
              value={value ?? ""}
              onChange={(e) => onChange(id, e.target.value)}
              style={{
                width: 50,
                backgroundColor: inputSemFundo
                  ? "transparent"
                  : corFundoInput ?? "#ffffff",
                color: (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black") : corTextoInput ?? "black"),
                border: "none",
                borderBottom: "1px solid " + (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black") : corTextoInput ?? "black"),
                textAlign: "center",
                borderRadius: "5px 5px 0 0"
              }}
            />
          </div>
        )}

        {(inputType === "text" || inputType === undefined) && (
          <div style={{ display: "inline-block", maxWidth: "100%" }}>
            <span
              ref={spanRef}
              style={{
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre-wrap",
                font: "inherit",
                padding: 0,
              }}
            >
              {value || placeholder || ""}
            </span>

            <textarea
              placeholder={placeholder}
              name={id}
              id={id}
              value={value ?? ""}
              onChange={(e) => onChange(id, e.target.value)}
              style={{
                width: inputWidth,
                minWidth: 20,
                maxWidth: 300,
                resize: "none",
                overflow: "hidden",
                lineHeight: "1.2em",
                boxSizing: "border-box",
                font: "inherit",
                backgroundColor: inputSemFundo
                  ? "transparent"
                  : corFundoInput ?? "#ffffff",
                color: (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black") : corTextoInput ?? "black"),
                border: "none",
                borderBottom: "1px solid " + (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black") : corTextoInput ?? "black"),
                textAlign: "center",
                borderRadius: "5px 5px 0 0"
              }}
              rows={1}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
          </div>
        )}

        {inputType === "select" && (
          <select
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            style={{
              backgroundColor: inputSemFundo
                ? "transparent"
                : corFundoInput ?? "#ffffff",
              color: (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black" ) : corTextoInput ?? "black"),
              border: "none",
              borderBottom: "1px solid " + (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black") : corTextoInput ?? "black"),
              textAlign: "center",
              borderRadius: "5px 5px 0 0"
            }}
          >
            {selectOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {inputType === "img" && (
          <img
            src={imagem}
            style={{
              backgroundColor: inputSemFundo
                ? "transparent"
                : corFundoInput ?? "#ffffff",
              color: (inputSemFundo ? (idCampo == id ? corTextoSelected ?? "white" : corTexto ?? "black" ) : corTextoInput ?? "black"),
              borderRadius: "5px 5px 0 0",
              width: tamanhoImagem ?? "auto"
            }}
          />
        )}

        {macro && (
          <button onClick={() => Roll(macro, title)} className={styles.btnDice}>
            {/* <img
              src="/d20.svg"
              width={30}
              style={{ margin: 0, fill: "white" }}
              alt="Roll dice"
            /> */}
            <D20
              width={30}
              style={{
                margin: 0,
                fill: (semFundo
                  ? (idCampo == id
                    ? corTextoSelected ?? "white"
                    : corTexto ?? "black")
                  : (idCampo == id
                  ? corFundo ?? "var(--Secundaria)"
                  : corBorda ?? "var(--Primaria)")),
              }}
            ></D20>
          </button>
        )}
      </div>
    </div>
  );
});
