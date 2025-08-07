// Ficheiro: src/app/kit-iot/page.tsx (Corrigido)
import Link from 'next/link';
import Image from 'next/image';
import { FiCpu, FiCode, FiZap, FiCloud, FiTool, FiSmile, FiShield, FiLogIn, FiCheckCircle } from 'react-icons/fi';

// Componente para um item de benefício
const BenefitItem = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-gray-400 mt-1">{children}</p>
        </div>
    </div>
);

export default function KitIotPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            {/* ===== Cabeçalho Fixo ===== */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-lg border-b border-gray-800">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Soneh.
                    </Link>
                    <div className="flex items-center gap-4">
                         <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                            <FiLogIn />
                            <span>Acessar Plataforma</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="pt-24 sm:pt-28">

                {/* ===== Seção Principal (Hero) ===== */}
                <section className="text-center container mx-auto px-6 py-12 sm:py-20">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                            Tire sua Ideia do Papel. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Hoje.</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                            O Kit IoT Soneh é a ponte entre sua visão e a realidade. Hardware poderoso e software intuitivo para você criar projetos incríveis, **sem precisar programar uma única linha de código**.
                        </p>
                        <div className="mt-10">
                            <a href="#comprar" className="inline-block px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
                                Quero o Meu Kit Agora
                            </a>
                        </div>
                    </div>
                </section>

                {/* ===== Seção Problema vs Solução ===== */}
                <section className="container mx-auto px-6 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold text-white mb-4">Cansado da complexidade?</h2>
                            <ul className="space-y-4">
                                <BenefitItem icon={<FiCode size={24}/>} title="Chega de Códigos Intimidadores">Esqueça a frustração de aprender linguagens complexas e configurar ambientes de desenvolvimento do zero.</BenefitItem>
                                <BenefitItem icon={<FiTool size={24}/>} title="Fim das Configurações Intermináveis">Diga adeus às horas perdidas com drivers, bibliotecas e uploads manuais de firmware.</BenefitItem>
                                <BenefitItem icon={<FiSmile size={24}/>} title="Concentre-se no que Importa: Sua Ideia">Nós cuidamos da tecnologia pesada para que você possa focar em criar e inovar.</BenefitItem>
                            </ul>
                        </div>
                         <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                             <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                                 {/* ✨ CORREÇÃO: Caminho do GIF atualizado ✨ */}
                                 <Image src="/screenshots/kit-esp32-e-painel-final.gif" alt="Demonstração do Kit Soneh" width={500} height={281} unoptimized className="rounded-lg" />
                             </div>
                         </div>
                    </div>
                </section>

                {/* ===== Seção Ecossistema Soneh ===== */}
                <section className="py-24 bg-gray-900/60">
                    <div className="container mx-auto px-6">
                         <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-4xl font-bold text-white">O Ecossistema Completo para o seu Sucesso</h2>
                            <p className="mt-4 text-gray-400">Você não recebe apenas uma placa. Você recebe uma solução completa e integrada.</p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8 text-center">
                            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700"><FiCpu size={32} className="mx-auto text-purple-400 mb-4"/> <h3 className="text-xl font-bold text-white">Hardware de Ponta</h3><p className="text-gray-400 mt-2">Placa ESP32 com Wi-Fi, Bluetooth e poder de processamento para IA e Visão Computacional.</p></div>
                            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700"><FiCloud size={32} className="mx-auto text-purple-400 mb-4"/> <h3 className="text-xl font-bold text-white">Plataforma na Nuvem</h3><p className="text-gray-400 mt-2">Acesso vitalício ao painel Soneh para gerir, controlar e monitorar seus dispositivos de qualquer lugar.</p></div>
                            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700"><FiZap size={32} className="mx-auto text-purple-400 mb-4"/> <h3 className="text-xl font-bold text-white">Firmware Inteligente</h3><p className="text-gray-400 mt-2">Nosso firmware otimizado com atualizações remotas (OTA) que conecta seu hardware à nuvem magicamente.</p></div>
                        </div>
                    </div>
                </section>

                {/* ===== Seção de Preços e CTA Final ===== */}
                <section id="comprar" className="bg-gray-900">
                    <div className="container mx-auto px-6 py-24">
                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 sm:p-12 border-2 border-purple-500/50 shadow-2xl shadow-purple-900/30">
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-4xl font-extrabold text-white">Adquira o Kit Completo</h3>
                                    <p className="text-gray-400 mt-2">Uma única compra, acesso vitalício. Sem mensalidades.</p>
                                    <div className="my-8">
                                        <p className="text-5xl font-bold text-white">R$ 119,90</p>
                                        <p className="text-green-400 font-semibold">Portes Grátis para todo o Brasil</p>
                                    </div>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> 1x Placa ESP32 (XIAO ESP32S3)</li>
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> Acesso¹ à Plataforma Soneh</li>
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> Firmware Otimizado com OTA</li>
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> Tutoriais Exclusivo</li>
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> Suporte Exclusivo</li>
                                        <li className="flex items-center gap-3"><FiCheckCircle className="text-green-500"/> Tutoriais e Suporte Exclusivo</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-900/50 p-8 rounded-2xl text-center">
                                    <p className="text-lg font-semibold text-white">Comece sua jornada IoT agora mesmo.</p>
                                     <a href="/checkout/kit-iot" className="w-full mt-6 inline-block py-4 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
                                         COMPRAR AGORA
                                     </a>
                                     <div className="mt-8">
                                         <p className="text-sm text-yellow-400/80 mb-4">
                                             Entrega em até 20 dias úteis com rastreamento. **Valor final, sem taxas de importação surpresa!**
                                         </p>
                                         <div className="flex justify-center items-center gap-4 grayscale opacity-60">
                                             <FiShield size={20} title="Compra Segura"/>
                                             {/* ✨ CORREÇÃO: Caminhos das imagens atualizados ✨ */}
                                             <Image src="/screenshots/payment_visa.png" alt="Visa" width={40} height={25} />
                                             <Image src="/screenshots/payment_mastercard.png" alt="Mastercard" width={40} height={25} />
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                 {/* ===== Rodapé ===== */}
                 <footer className="border-t border-gray-800">
                     <div className="container mx-auto px-6 py-8 text-center text-gray-400">
                         <p>&copy; {new Date().getFullYear()} Plataforma Soneh. Todos os direitos reservados.</p>
                     </div>
                 </footer>
            </main>
        </div>
    );
}
