// src/pages/Calculadora/quizQuestions.js

export const initialDataState = {
    clienteNome: '', clienteTelefone: '', clienteEmail: '', endereco: '', tipoServico: 'RESIDENCIAL',
    metragemQuadrada: 0, padraoMonofasico: 'MONOFASICO', quantidadeTomadas: 0, quantidadePontosLuz: 0,
    quantidadeChuveiros: 0, quantidadeArCondicionado: 0, distanciaPosteQuadro: 0,
    nivelComplexidade: 'MEDIO',
    observacoes: 'Orçamento gerado via App Web.',
    result: null,
    savedToFirestore: false,
};

export const quizQuestions = [
    { id: 'clienteNome', label: '1/12. Qual seu Nome Completo?', type: 'text', placeholder: 'Ex: João da Silva', help: 'Seu nome será usado na identificação do orçamento.' },
    { id: 'clienteTelefone', label: '2/12. Qual seu WhatsApp (com DDD)?', type: 'tel', placeholder: 'Ex: 5511987654321', help: 'Usado para envio e contato rápido. (Sem formatação)' },
    { id: 'clienteEmail', label: '3/12. Qual seu E-mail principal?', type: 'email', placeholder: 'seu.melhor@email.com', help: 'O relatório completo será enviado para este e-mail.' },
    { id: 'endereco', label: '4/12. Endereço da Obra (Cidade/Bairro)?', type: 'text', placeholder: 'Ex: Bairro Central, Cidade X', help: 'Usado para estimativa de logística.' },
    { id: 'tipoServico', label: '5/12. Qual o Tipo de Imóvel?', type: 'select', options: [
            { value: 'RESIDENCIAL', text: 'Residencial 🏠' },
            { value: 'COMERCIAL', text: 'Comercial 🏢' },
            { value: 'INDUSTRIAL', text: 'Industrial 🏭' }
        ], help: 'Define as normas técnicas (ABNT/NTS) aplicadas.' },
    { id: 'metragemQuadrada', label: '6/12. Qual a Metragem Quadrada Total (m²)?', type: 'number', placeholder: 'Ex: 150', help: 'Apenas a área construída.' },
    { id: 'padraoMonofasico', label: '7/12. Qual o Padrão de Entrada Desejado?', type: 'select', options: [
            { value: 'MONOFASICO', text: 'Monofásico (1 fase + neutro)' },
            { value: 'BIFASICO', text: 'Bifásico (2 fases + neutro)' },
            { value: 'TRIFASICO', text: 'Trifásico (3 fases + neutro)' }
        ], help: 'Crucial para o dimensionamento do Ramal e Quadro Geral.' },
    { id: 'quantidadeTomadas', label: '8/12. Quantas Tomadas Comuns (TUGs)?', type: 'number', placeholder: 'Ex: 35', help: 'Tomadas de uso geral (computador, TV, etc.).' },
    { id: 'quantidadePontosLuz', label: '9/12. Quantos Pontos de Iluminação?', type: 'number', placeholder: 'Ex: 18', help: 'Spots, lustres, lâmpadas, etc.' },
    { id: 'quantidadeChuveiros', label: '10/12. Quantos Chuveiros Elétricos?', type: 'number', placeholder: 'Ex: 2', help: 'Aparelhos de alta potência (TUEs).' },
    { id: 'quantidadeArCondicionado', label: '11/12. Quantos Ar Condicionado?', type: 'number', placeholder: 'Ex: 3', help: 'Unidades de ar condicionado de qualquer potência.' },
    { id: 'distanciaPosteQuadro', label: '12/12. Distância Poste/Medidor ao Quadro (m)?', type: 'number', placeholder: 'Ex: 8', help: 'Mede o comprimento do Ramal de Entrada.' },
];