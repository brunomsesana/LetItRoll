import { useEffect, useState } from "react";
import Canvas from "../../components/Canvas";
import styles from "./CriarSistema.module.css";
import { Navbar } from "../../components";
import { CampoData } from "../../Interfaces";

export default function CriarSistema() {
  const [campos, setCampos] = useState<CampoData[]>([]);
  const [campoSelecionado, setCampoSelecionado] = useState<CampoData>();
  const [campoTemp, setCampoTemp] = useState<CampoData>();
  const [erro, setErro] = useState<string>("");
  const [copiedCampo, setCopiedCampo] = useState<CampoData | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [corDoFundo, setCorDoFundo] = useState<string>("#663131");

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
      setCampos([
        ...campos,
        {
          id: newId.toString(),
          x: 0,
          y: 0,
          semFundo: false,
          inputSemFundo: false,
          layer: 0
        },
      ]);
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
            style={{ backgroundColor: corDoFundo }}
          />
        </div>
        <div className={styles.editCampo} style={{ height: canvasHeight }}>
          {campoSelecionado && campoTemp ? (
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
              {campoTemp.inputType == "img" && <><label className={styles.label}>
                Imagem:{" "}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCampoTemp({
                          ...campoTemp!,
                          imagem: reader.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <label className={styles.label}>
                Largura da imagem (em pixels):{" "}
                <input
                  type="text"
                  value={campoTemp?.tamanhoImagem ?? ""}
                  onChange={(e) =>
                    campoTemp
                      ? setCampoTemp({ ...campoTemp, tamanhoImagem: parseInt(e.target.value) })
                      : null
                  }
                />
              </label></>}
              <div
                className={styles.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p>Cores do campo: </p>
                <label className={styles.label}>
                  Sem fundo:{" "}
                  <input
                    type="checkbox"
                    checked={campoTemp?.semFundo ?? false}
                    onChange={(e) =>
                      setCampoTemp({ ...campoTemp, semFundo: e.target.checked })
                    }
                  />
                </label>
                {!campoTemp.semFundo && (
                  <>
                    <label
                      className={styles.label}
                      style={{ width: "80%", textAlign: "center" }}
                    >
                      Cor do fundo (e borda quando selecionado):{" "}
                      <input
                        type="color"
                        value={campoTemp?.corFundo ?? "#c97d7d"}
                        onChange={(e) =>
                          setCampoTemp({
                            ...campoTemp,
                            corFundo: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label
                      className={styles.label}
                      style={{ width: "80%", textAlign: "center" }}
                    >
                      Cor da borda (e fundo quando selecionado):{" "}
                      <input
                        type="color"
                        value={campoTemp?.corBorda ?? "#590202"}
                        onChange={(e) =>
                          setCampoTemp({
                            ...campoTemp,
                            corBorda: e.target.value,
                          })
                        }
                      />
                    </label>
                  </>
                )}
                <label
                  className={styles.label}
                  style={{ width: "80%", textAlign: "center" }}
                >
                  Cor do texto:{" "}
                  <input
                    type="color"
                    value={campoTemp?.corTexto ?? "#000000"}
                    onChange={(e) =>
                      setCampoTemp({ ...campoTemp, corTexto: e.target.value })
                    }
                  />
                </label>
                <label
                  className={styles.label}
                  style={{ width: "80%", textAlign: "center" }}
                >
                  Cor do texto quando selecionado:{" "}
                  <input
                    type="color"
                    value={campoTemp?.corTextoSelected ?? "#ffffff"}
                    onChange={(e) =>
                      setCampoTemp({
                        ...campoTemp,
                        corTextoSelected: e.target.value,
                      })
                    }
                  />
                </label>
                <div
                  className={styles.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label className={styles.label}>
                    {campoTemp.inputType == "img" ? "Imagem" : "Input"} sem
                    fundo:{" "}
                    <input
                      type="checkbox"
                      checked={campoTemp?.inputSemFundo ?? false}
                      onChange={(e) =>
                        setCampoTemp({
                          ...campoTemp,
                          inputSemFundo: e.target.checked,
                        })
                      }
                    />
                  </label>
                  {!campoTemp.inputSemFundo && (
                    <>
                      <label
                        className={styles.label}
                        style={{ width: "80%", textAlign: "center" }}
                      >
                        Cor de fundo{" "}
                        {campoTemp.inputType == "img"
                          ? "da imagem"
                          : "do input"}
                        :{" "}
                        <input
                          type="color"
                          value={campoTemp?.corFundoInput ?? "#ffffff"}
                          onChange={(e) =>
                            setCampoTemp({
                              ...campoTemp,
                              corFundoInput: e.target.value,
                            })
                          }
                        />
                      </label>
                      {!(campoTemp.inputType == "img") && (
                        <label
                          className={styles.label}
                          style={{ width: "80%", textAlign: "center" }}
                        >
                          Cor do texto do input:{" "}
                          <input
                            type="color"
                            value={campoTemp?.corTextoInput ?? "#000000"}
                            onChange={(e) =>
                              setCampoTemp({
                                ...campoTemp,
                                corTextoInput: e.target.value,
                              })
                            }
                          />
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>
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
                  <option value="img">Imagem</option>
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
          ) : (
            <>
              <label>
                Cor do fundo:{" "}
                <input
                  type="color"
                  value={corDoFundo}
                  onChange={(e) => setCorDoFundo(e.target.value)}
                />
              </label>
            </>
          )}
          <div className={styles.bottomBar}>
            <button style={{ margin: 5 }} onClick={() => handleAdd()}>
              Criar novo campo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
