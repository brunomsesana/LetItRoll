import { DndContext, useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import styles from "./Canvas.module.css";

interface CampoData {
  id: string;
  x: number;
  y: number;
  title?: string;
  inputType?: string;
  placeholder?: string;
  macro?: string;
  value?: string; // <--- Adicionado para armazenar o valor digitado
}

export default function Canvas() {
  const [campos, setCampos] = useState<CampoData[]>([
    { id: "campo-1", x: 0, y: 0, inputType: "text", placeholder: "Nome", macro: "[1d20]" },
    { id: "campo-2", x: 0, y: 0, title: "Força", inputType: "number", macro: "[[1d20] + {campo-2}]" },
  ]);

  const Roll = (macro: string) => {
    const resultado = macro.replace(/\{(.*?)\}/g, (_, chave) => {
      const campo = campos.find(c => c.id === chave);
      return campo?.value ?? `{${chave}}`; // mantém o original se não encontrar o valor
    });

    console.log("Macro final:", resultado);

    fetch("http://localhost:5148/api/Dice/roll?macro=" + encodeURIComponent(resultado))
      .then(res => res.json())
      .then(data => {
        console.log("Resultado:", data.resultado);
        console.log("Rolagens:", data.rolagens);
      })
      .catch(error => console.error("Erro na requisição:", error));
  };

  function handleInputChange(id: string, valor: string) {
    setCampos(prev =>
      prev.map(c =>
        c.id === id ? { ...c, value: valor } : c
      )
    );
  }

  function handleDragEnd(event: any) {
    const { delta, active } = event;

    setCampos(prev =>
      prev.map(campo =>
        campo.id === active.id
          ? {
              ...campo,
              x: campo.x + delta.x,
              y: campo.y + delta.y,
            }
          : campo
      )
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.canvasArea}>
        {campos.map((campo) => (
          <Campo
            key={campo.id}
            {...campo}
            Roll={Roll}
            onChange={handleInputChange}
          />
        ))}
      </div>
    </DndContext>
  );
}

interface CampoProps extends CampoData {
  Roll: (macro: string) => void;
  onChange: (id: string, valor: string) => void;
}

function Campo({ id, x, y, title, inputType, placeholder, macro, Roll, value, onChange }: CampoProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const finalX = x + (transform?.x ?? 0);
  const finalY = y + (transform?.y ?? 0);

  const isDragging = transform !== null;

  return (
    <div
      ref={setNodeRef}
      className={styles.campo}
      style={{
        transform: `translate(${finalX}px, ${finalY}px)`,
        position: "absolute",
        transition: transform ? "none" : "transform 200ms ease",
        filter: isDragging ? "brightness(1.25)" : "brightness(1)",
        boxShadow: isDragging ? "0 0 10px rgba(0,0,0,0.3)" : "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        {...listeners}
        {...attributes}
        className={styles.dragHandle}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        ⠿
      </div>

      <div className={styles.content}>
        {title && <label style={{ marginRight: 10 }} htmlFor={id}>{title}: </label>}
        <input
          type={inputType ?? "text"}
          placeholder={placeholder}
          name={id}
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
        />
        {macro && (
          <button onClick={() => Roll(macro)} className={styles.btnDice}>
            <img src="/d20.png" width={30} style={{ margin: 0 }} alt="Roll dice" />
          </button>
        )}
      </div>
    </div>
  );
}
