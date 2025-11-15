/**
 * Rola a tela suavemente até a seção com o ID especificado.
 * @param {string} id O ID da seção de destino (ex: 'servicos').
 */
export const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        // Usa behavior: 'smooth' para rolagem suave
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};