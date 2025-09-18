export interface User{
    name: string,
    lastName: string,
    email: string,
}
export interface CampoData {
    id: string;
    x: number;
    y: number;
    title?: string;
    inputType?: string;
    placeholder?: string;
    macro?: string;
    value?: string;
    selectOptions?: { value: string; label: string }[];
    semFundo: boolean;
    corFundo?: string;
    corBorda?: string;
    corTexto?: string;
    corTextoSelected?: string;
    corFundoInput?: string;
    corTextoInput?: string;
    inputSemFundo: boolean;
    imagem?: string;
    tamanhoImagem?: number;
    layer: number;
  }