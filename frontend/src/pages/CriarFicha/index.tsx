import { useEffect, useState } from "react";
import Canvas from "../../components/Canvas";
import styles from "./CriarFicha.module.css";
import { Navbar } from "../../components";

interface CampoData {
  id: string;
  x: number;
  y: number;
  title?: string;
  inputType?: string;
  placeholder?: string;
  macro?: string;
  value?: string;
  selectOptions?: { value: string; label: string }[];
}

export default function CriarFicha() {
  const [campos, setCampos] = useState<CampoData[]>([]);
  const [campoSelecionado, setCampoSelecionado] = useState<CampoData>();
  const [campoTemp, setCampoTemp] = useState<CampoData>();
  const [erro, setErro] = useState<string>("");
  const [copiedCampo, setCopiedCampo] = useState<CampoData | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);

  useEffect(() => {
    if (!campoSelecionado) return;

    setCampos((prevCampos) =>
      prevCampos.map((x) =>
        x.id === campoSelecionado.id ? campoSelecionado : x
      )
    );
  }, [campoSelecionado]);

  useEffect(() => {
    setCampoTemp(campoSelecionado ? { ...campoSelecionado } : undefined);
  }, [campoSelecionado?.id]);

  function handleCopyPaste() {
    if (!campoSelecionado) return;
    setCopiedCampo({ ...campoSelecionado });
    if (!copiedCampo) return;
    let newId = (campos.length + 1).toString();
    while (campos.some((c) => c.id === newId)) {
      newId = (parseInt(newId) + 1).toString();
    }

    let newMacro = copiedCampo.macro;
    if (newMacro && copiedCampo.id) {
      const regex = new RegExp(`\\b${copiedCampo.id}\\b`, "g");
      newMacro = newMacro.replace(regex, newId);
    }

    const newCampo: CampoData = {
      ...copiedCampo,
      id: newId,
      macro: newMacro,
      x: copiedCampo.x + 10,
      y: copiedCampo.y + 10,
    };

    setCampos((prev) => [...prev, newCampo]);
    setCampoSelecionado(newCampo);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (!campoSelecionado) return;

      if (e.ctrlKey && e.key === "c") {
        setCopiedCampo({ ...campoSelecionado });
        e.preventDefault();
      }

      if (e.ctrlKey && e.key === "v") {
        if (!copiedCampo) return;
        e.preventDefault();

        let newId = (campos.length + 1).toString();
        while (campos.some((c) => c.id === newId)) {
          newId = (parseInt(newId) + 1).toString();
        }

        let newMacro = copiedCampo.macro;
        if (newMacro && copiedCampo.id) {
          const regex = new RegExp(`\\b${copiedCampo.id}\\b`, "g");
          newMacro = newMacro.replace(regex, newId);
        }

        const newCampo: CampoData = {
          ...copiedCampo,
          id: newId,
          macro: newMacro,
          x: copiedCampo.x + 10,
          y: copiedCampo.y + 10,
        };

        setCampos((prev) => [...prev, newCampo]);
        setCampoSelecionado(newCampo);
      }
      if (e.key === "Delete") {
        setCampos((prev) => prev.filter((c) => c.id !== campoSelecionado.id));
        setCampoSelecionado(undefined);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [campoSelecionado, copiedCampo, campos]);

  function handleSave() {
    const oldId = campoSelecionado?.id;

    if (campoTemp?.inputType === "select" && campoTemp?.selectOptions) {
      const valores = campoTemp.selectOptions.map((o) => o.value.trim());
      const valoresUnicos = new Set(valores);
      if (valores.length !== valoresUnicos.size) {
        setErro("As opções do select não podem ter valores duplicados");
        return;
      }
    }

    if (campoTemp?.id) {
      if (
        campos.flatMap((x) => x.id).includes(campoTemp.id) &&
        !(oldId == campoTemp.id)
      ) {
        setErro("ID do campo não pode ser igual a outro já existente");
      } else {
        if (!campoSelecionado || !campoTemp) return;

        const novoCampo = {
          ...campoTemp,
          x: campoSelecionado.x,
          y: campoSelecionado.y,
        };

        setCampos((prev) => prev.map((c) => (c.id === oldId ? novoCampo : c)));
        setCampoSelecionado(novoCampo);
        setErro("");
      }
    } else {
      setErro("ID do campo não pode ser vazio");
    }
  }

  function handleAdd(id?: number) {
    const newId = id ?? campos.length + 1;
    if (campos.flatMap((x) => x.id).includes(newId.toString())) {
      handleAdd(newId + 1);
    } else {
      setCampos([...campos, { id: newId.toString(), x: 0, y: 0 }]);
      setErro("");
    }
  }

  return (
    <>
      <Navbar />
      <div
        className={styles.divGeral}
        style={{ display: "flex", paddingTop: 100 }}
      >
        <div style={{ width: "80%" }}>
          <Canvas
            campos={campos}
            setCampos={setCampos}
            setCampoSelecionado={setCampoSelecionado}
            campoSelecionado={campoSelecionado}
            setErro={setErro}
            onHeightChange={(h) => setCanvasHeight(h)}
          />
        </div>
        <div className={styles.editCampo} style={{ height: canvasHeight }}>
          {campoSelecionado && campoTemp && (
            <>
              {erro && (
                <p
                  style={{
                    padding: 10,
                    backgroundColor: "var(--Primaria)",
                    border: "5px solid var(--Fundo)",
                    borderRadius: 20,
                    margin: 20,
                    position: "absolute",
                    top: 0,
                  }}
                >
                  {erro}
                </p>
              )}
              <h1>Editar campo</h1>
              <p>
                Campo selecionado:{" "}
                {(campoSelecionado?.title ?? "") + ` (${campoSelecionado?.id})`}
              </p>
              <label className={styles.label}>
                ID:{" "}
                <input
                  type="text"
                  value={campoTemp?.id ?? ""}
                  onChange={(e) =>
                    campoTemp
                      ? setCampoTemp({ ...campoTemp, id: e.target.value })
                      : null
                  }
                />
              </label>
              <label className={styles.label}>
                Texto:{" "}
                <input
                  type="text"
                  value={campoTemp?.title ?? ""}
                  onChange={(e) =>
                    campoTemp
                      ? setCampoTemp({ ...campoTemp, title: e.target.value })
                      : null
                  }
                />
              </label>
              <label className={styles.label}>
                Macro (Rolagem):{" "}
                <input
                  type="text"
                  value={campoTemp?.macro ?? ""}
                  onChange={(e) =>
                    campoTemp
                      ? setCampoTemp({ ...campoTemp, macro: e.target.value })
                      : null
                  }
                />
              </label>
              <label className={styles.label}>
                Tipo:
                <select
                  value={campoTemp?.inputType ?? "text"}
                  onChange={(e) =>
                    setCampoTemp({ ...campoTemp, inputType: e.target.value })
                  }
                >
                  <option value="text">Entrada de texto</option>
                  <option value="number">Entrada de número</option>
                  <option value="select">Seleção</option>
                  <option value="header">Texto</option>
                </select>
              </label>
              {campoTemp?.inputType === "select" && (
                <div className={styles.label}>
                  Opções:
                  {campoTemp.selectOptions?.map((x, i) => (
                    <div className={styles.label} key={"option" + i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p>Opção {i + 1}: </p>
                        <button
                          onClick={() => {
                            setCampoTemp({
                              ...campoTemp,
                              selectOptions: campoTemp.selectOptions?.filter(
                                (y, j) => j !== i
                              ),
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                      <div>
                        <label>
                          Label:
                          <input
                            type="text"
                            value={x.label}
                            onChange={(e) =>
                              setCampoTemp({
                                ...campoTemp,
                                selectOptions: campoTemp.selectOptions?.map(
                                  (y, j) =>
                                    j === i
                                      ? { ...y, label: e.target.value }
                                      : y
                                ),
                              })
                            }
                          />
                        </label>
                        <label>
                          Valor:
                          <input
                            type="text"
                            value={x.value}
                            onChange={(e) =>
                              setCampoTemp({
                                ...campoTemp,
                                selectOptions: campoTemp.selectOptions?.map(
                                  (y, j) =>
                                    j === i
                                      ? { ...y, value: e.target.value }
                                      : y
                                ),
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    style={{ margin: 5 }}
                    onClick={() => {
                      const newOption = { value: "", label: "" };
                      setCampoTemp({
                        ...campoTemp,
                        selectOptions: campoTemp.selectOptions
                          ? [...campoTemp.selectOptions, newOption]
                          : [newOption],
                      });
                    }}
                  >
                    Adicionar opção
                  </button>
                </div>
              )}
              <button style={{ margin: 5 }} onClick={handleSave}>
                Salvar
              </button>
              <button
                style={{ margin: 5 }}
                onClick={() => {
                  setCampos((prev) =>
                    prev.filter((x) => x.id !== campoSelecionado?.id)
                  );
                  setCampoSelecionado(undefined);
                }}
              >
                Excluir Campo
              </button>
              <button
                style={{ margin: 5 }}
                onClick={() => {
                  handleCopyPaste();
                }}
              >
                Duplicar campo
              </button>
            </>
          )}
          <button style={{ margin: 5 }} onClick={() => handleAdd()}>
            Criar novo campo
          </button>
        </div>
      </div>
    </>
  );
}
