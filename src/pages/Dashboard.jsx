import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calculator, Zap, HardHat, Factory, Home, MapPin, Layers, Settings, LogOut, CheckCircle, Phone, Mail, Map, Clock, ClipboardCheck, Battery } from 'lucide-react';

// Componentes de Animação e UI
import AnimatedSection from '../components/ui/AnimatedSection';
import EnergyAnimation from '../components/ui/EnergyAnimation';
import TypingSlogan from '../components/ui/TypingSlogan';

// --- DADOS DA LANDING PAGE ---
const TITLE_PHRASES = [
    "AD Comandos: Engenharia & Precisão",
    "AD Comandos: Seu Parceiro em Automação",
];

const SUBTITLE_PHRASES = [
    "soluções e tecnologias.",
    "automação e acuracidade.",
    "segurança e inovação.",
];

const serviceTypes = [
    { icon: Factory, title: 'Industrial', description: 'Cálculos de carga para grandes parques fabris e sistemas de automação pesada.' },
    { icon: Home, title: 'Residencial', description: 'Orçamentos completos para casas, apartamentos e condomínios, focando em segurança.' },
    { icon: Battery, title: 'Sistemas de Energia', description: 'Design e cálculo de iluminação eficiente e sistemas de comandos elétricos.' },
    { icon: HardHat, title: 'Segurança Eletrônica', description: 'Estimativa de custos para instalação de concertinas, CFTV e alarmes perimetrais.' },
];

const calculatorSteps = [
    { step: 1, icon: ClipboardCheck, title: 'Definição do Projeto', description: 'Selecione o tipo de ambiente (residencial, comercial ou industrial).' },
    { step: 2, icon: Layers, title: 'Insumos e Cargas', description: 'Informe detalhes de lâmpadas, tomadas, motores e demais equipamentos.' },
    { step: 3, icon: Zap, title: 'Processamento NBR', description: 'Análise automática e precisa, em total conformidade com as normas técnicas.' },
    { step: 4, icon: Clock, title: 'Relatório Instantâneo', description: 'Gere o orçamento detalhado com lista de materiais e custos estimados.' },
];

// Classes para alternância de fundo
const GRAPHITE_SECTION = "relative min-h-screen flex items-center bg-[#0d1117] text-white overflow-hidden";
const ICE_SECTION = "relative min-h-screen flex items-center bg-[#f0f8ff] py-20 border-t border-gray-100";


/**
 * Componente Dashboard / Landing Page Interativa.
 */
const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const displayName = isAuthenticated ? (user?.username || 'Orçamentista') : 'Visitante';

    return (
        <div className="relative overflow-x-hidden">

            {/* 1. SEÇÃO HERO (LAYOUT 1 COLUNA: ⬛) */}
            <section id="inicio" className={GRAPHITE_SECTION}>
                <EnergyAnimation />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center w-full">
                    {/* ... Conteúdo 1 Coluna ... */}
                    <AnimatedSection delay={100} className="w-full">
                        <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300 tracking-tight mb-4">
                            <TypingSlogan phrases={TITLE_PHRASES} className="inline-block"/>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={400} className="w-full">
                        <p className="text-xl md:text-3xl text-gray-400 mb-12 max-w-4xl mx-auto font-light">
                            AD Comandos foca em
                            <TypingSlogan phrases={SUBTITLE_PHRASES} className="font-extrabold text-amber-300 ml-2 inline-block"/>
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={700} className="w-full space-y-4">
                        <Link to="/quiz" className="inline-flex items-center justify-center bg-amber-600 text-gray-900 font-extrabold py-5 px-16 rounded-2xl text-2xl shadow-xl transition duration-500 transform hover:scale-[1.05] hover:bg-amber-500">
                            <Calculator size={30} className="mr-4"/> Calcular Orçamento Agora
                        </Link>
                        <p className="text-sm text-gray-500 pt-2">
                            Bem-vindo(a), **{displayName}**. O login salva seu progresso.
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Divisor 1: Grafite para Gelo */}
            <div className="relative z-10 -mt-16 sm:-mt-24 lg:-mt-32">
                <svg className="w-full h-32 md:h-48 lg:h-64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon fill="#f0f8ff" points="0,100 100,0 100,100"/>
                </svg>
            </div>

            {/* 2. TIPOS DE SERVIÇO (LAYOUT 4 COLUNAS: 🔷) */}
            <section id="servicos" className={ICE_SECTION}>
                <div className="max-w-7xl mx-auto px-6 w-full pt-16">
                    <AnimatedSection delay={100} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-violet-700 mb-4">Nossa Expertise Técnica</h2>
                        <p className="text-xl text-gray-600">Projetos elétricos de alta performance e sistemas de segurança integrados.</p>
                    </AnimatedSection>

                    {/* Grid de 4 Colunas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {serviceTypes.map((service, index) => (
                            <AnimatedSection key={service.title} delay={200 + index * 150}>
                                <div className="p-8 bg-white rounded-2xl shadow-xl border-t-4 border-amber-600 hover:shadow-2xl transition duration-500 transform hover:scale-[1.03]">
                                    <service.icon size={40} className="text-amber-600 mb-4 mx-auto"/>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{service.title}</h3>
                                    <p className="text-gray-600 text-sm text-center">{service.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divisor 2: Gelo para Grafite */}
            <div className="relative z-10">
                <svg className="w-full h-32 md:h-48 lg:h-64 -mt-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon fill="#0d1117" points="0,0 100,100 0,100"/>
                </svg>
            </div>

            {/* 3. COMO FUNCIONA A CALCULADORA (LAYOUT 4 COLUNAS: 🔷) */}
            <section id="calculadora" className={GRAPHITE_SECTION}>
                <EnergyAnimation />
                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-16">
                    <AnimatedSection delay={100} className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-4">Metodologia de Cálculo ⚙️</h2>
                        <p className="text-xl text-gray-400">Precisão e conformidade em quatro etapas de engenharia.</p>
                    </AnimatedSection>

                    {/* Grid de 4 Colunas */}
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
                        {calculatorSteps.map((step, index) => (
                            <AnimatedSection key={step.step} delay={300 + index * 250}>
                                <div className="text-center p-6 rounded-2xl bg-gray-700/50 backdrop-blur-sm border border-amber-400/50 shadow-xl h-full transform hover:-translate-y-2 transition duration-300">
                                    <step.icon size={40} className="text-amber-400 mx-auto mb-4"/>
                                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-amber-600 text-gray-900 text-xl font-extrabold shadow-lg ring-4 ring-amber-400/30">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-amber-300 mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divisor 3: Grafite para Gelo */}
            <div className="relative z-10 -mt-16 sm:-mt-24 lg:-mt-32">
                <svg className="w-full h-32 md:h-48 lg:h-64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon fill="#f0f8ff" points="0,100 100,0 100,100"/>
                </svg>
            </div>

            {/* 4. ÁREA DE COBERTURA (LAYOUT 2 COLUNAS IGUAIS: ◽◼️) */}
            <section id="atendimento" className={ICE_SECTION}>
                <div className="max-w-7xl mx-auto px-6 w-full pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Coluna 1: Texto (Ocupa 1/2) */}
                    <AnimatedSection delay={100} className="order-2 lg:order-1">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-violet-700 mb-6">Presença Estratégica Regional 📍</h2>
                        <p className="text-gray-600 text-xl mb-8">
                            Nossa ferramenta alcança o Brasil, mas nosso serviço de campo e suporte especializado estão concentrados no eixo de desenvolvimento de Tocantins, garantindo eficiência logística.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center text-lg text-violet-600 font-semibold">
                                <MapPin size={24} className="mr-3 text-violet-500"/> Foco Operacional: **Palmas, Araguaína e Região Central do TO.**
                            </div>
                            <div className="flex items-center text-lg text-gray-700 font-semibold">
                                <CheckCircle size={24} className="mr-3 text-green-600"/> Padrão Técnico: **Conformidade total com a NBR 5410.**
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Coluna 2: Mapa (Ocupa 1/2) */}
                    <AnimatedSection delay={400} className="order-1 lg:order-2">
                        {/* Removido o aspect-square para manter o formato flexível, mas o 1/2 garante a proporção de coluna */}
                        <div className="p-6 bg-white rounded-3xl shadow-2xl border-4 border-amber-100 flex items-center justify-center min-h-[400px]">
                            <MapPin size={80} className="text-amber-500/50 absolute opacity-30 animate-pulse-slow"/>
                            <Map size={120} className="text-amber-600/80"/>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Divisor 4: Gelo para Grafite */}
            <div className="relative z-10">
                <svg className="w-full h-32 md:h-48 lg:h-64 -mt-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon fill="#0d1117" points="0,0 100,100 0,100"/>
                </svg>
            </div>

            {/* 5. CTA FINAL (LAYOUT 1 COLUNA: ⬛) - PENÚLTIMA SEÇÃO */}
            <section className="relative bg-[#0d1117] min-h-[50vh] flex items-center text-white overflow-hidden">
                <EnergyAnimation />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center w-full">
                    {/* ... Conteúdo 1 Coluna ... */}
                    <AnimatedSection delay={100}>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-amber-400 mb-6">
                            Maximize a Eficiência do Seu Próximo Projeto
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="inline-flex items-center justify-center bg-amber-600 text-gray-900 font-bold py-4 px-12 rounded-2xl text-xl shadow-lg hover:bg-amber-700 transition duration-300 transform hover:scale-[1.02] mt-6">
                            {isAuthenticated ? (
                                <>
                                    <Layers size={24} className="mr-3"/> Acessar Histórico
                                </>
                            ) : (
                                <>
                                    <Settings size={24} className="mr-3"/> Login / Cadastro
                                </>
                            )}
                        </Link>
                        {isAuthenticated && (
                            <button
                                onClick={logout}
                                className="ml-4 flex items-center justify-center px-6 py-4 border border-gray-600 text-gray-300 font-medium rounded-2xl hover:bg-gray-800 transition duration-300"
                            >
                                <LogOut size={24} className="mr-3"/> Sair
                            </button>
                        )}
                    </AnimatedSection>
                </div>
            </section>

            {/* Divisor 5: Grafite para Gelo */}
            <div className="relative z-10 -mt-16 sm:-mt-24 lg:-mt-32">
                <svg className="w-full h-32 md:h-48 lg:h-64" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon fill="#f0f8ff" points="0,100 100,0 100,100"/>
                </svg>
            </div>


            {/* 6. SEÇÃO CONTATO (LAYOUT 2 COLUNAS IGUAIS: ◽◼️) - ÚLTIMA SEÇÃO */}
            <section id="contato" className={ICE_SECTION}>
                <div className="max-w-4xl mx-auto px-6 w-full text-center pt-16">
                    <AnimatedSection delay={100} className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-violet-700 mb-4">Fale com Nossa Engenharia 💬</h2>
                        <p className="text-xl text-gray-600">Conecte-se diretamente com nossa equipe técnica.</p>
                    </AnimatedSection>

                    {/* Layout de 2 Colunas Iguais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <AnimatedSection delay={300}>
                            <div className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-amber-600 transition duration-300 hover:bg-gray-100">
                                <Phone size={40} className="text-amber-600 mb-3 mx-auto"/>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">Central de Atendimento</h3>
                                <p className="text-lg text-gray-700">(63) 9 9999-9999</p>
                            </div>
                        </AnimatedSection>
                        <AnimatedSection delay={500}>
                            <div className="p-8 bg-white rounded-2xl shadow-lg border-t-4 border-amber-600 transition duration-300 hover:bg-gray-100">
                                <Mail size={40} className="text-amber-600 mb-3 mx-auto"/>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">Suporte Técnico</h3>
                                <p className="text-lg text-gray-700">contato@adcomandos.com.br</p>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;