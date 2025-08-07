// Ficheiro: src/app/page.tsx (VERSÃO COMPLETA E CORRIGIDA)
import Link from 'next/link';
import Image from 'next/image';
import { FiCpu, FiWifi, FiTerminal, FiEye, FiArrowRight, FiLogIn, FiBox } from 'react-icons/fi';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Button } from '@/components/ui/button';

// Componente para os cartões de funcionalidades (mantido como no seu original)
const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl text-center transform transition-transform hover:scale-105 hover:border-purple-500">
    <div className="text-purple-400 inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {children}
    </p>
  </div>
);

// A página agora é um Server Component assíncrono
export default async function HomePage() {
  // Busca a sessão do usuário no lado do servidor
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200 font-sans">

      {/* ===== Cabeçalho Inteligente ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-lg border-b border-gray-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Soneh.
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/kit-iot" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition-colors">
              <FiBox /> Ver o Kit IoT
            </Link>

            {/* Lógica condicional: mostra um botão diferente se o usuário está logado ou não */}
            {session ? (
              <Link href="/dashboard">
                <Button className="bg-purple-600 hover:bg-purple-700">Meu Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                 <FiLogIn />
                 <span>Acessar Plataforma</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-24 sm:pt-32">
        {/* ===== Seção Principal (Hero) ===== */}
        <section className="text-center container mx-auto px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
              A Sua Plataforma Central para Inovação em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">IoT</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Controle, monitore e atualize seus dispositivos de hardware remotamente. Da prototipagem à produção, tudo em um só lugar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
                Comece a Criar Agora <FiArrowRight />
              </Link>
              <Link href="/kit-iot" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-gray-300 font-semibold rounded-full hover:bg-gray-800 transition-colors">
                Conheça o nosso Kit Físico
              </Link>
            </div>
          </div>
          <div className="mt-20 relative">
            <div className="absolute top-1/2 left-1/2 w-2/3 h-2/3 bg-purple-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <Image
              src="/screenshots/dashboard_screenshot1.jpg"
              alt="Painel da Plataforma Soneh"
              width={1000}
              height={563}
              className="rounded-2xl mx-auto shadow-2xl shadow-purple-900/40 border-2 border-gray-700 relative z-10"
              priority
            />
          </div>
        </section>

        {/* ===== Seção de Funcionalidades ===== */}
        <section id="features" className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Tudo o que Você Precisa para Seus Projetos IoT</h2>
            <p className="mt-3 text-gray-400">Ferramentas poderosas para acelerar seu desenvolvimento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<FiCpu size={32} />} title="Gestão de Dispositivos">
              Organize seus dispositivos em projetos, monitore o status online e gerencie configurações de forma centralizada.
            </FeatureCard>
            <FeatureCard icon={<FiWifi size={32} />} title="Controle Real-Time">
              Envie comandos e controle pinos (GPIO) instantaneamente através do nosso painel com comunicação MQTT de baixa latência.
            </FeatureCard>
            <FeatureCard icon={<FiTerminal size={32} />} title="Firmware OTA">
              Atualize o firmware dos seus dispositivos remotamente, sem a necessidade de conexão física. Agilidade e segurança para suas iterações.
            </FeatureCard>
            <FeatureCard icon={<FiEye size={32} />} title="Recursos de IA">
              Explore o futuro com funcionalidades prontas para visão computacional e áudio, permitindo projetos mais inteligentes e interativos.
            </FeatureCard>
          </div>
        </section>

        {/* ===== Seção de Depoimentos ===== */}
        <section className="bg-gray-900/50 py-24">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Amado por Criadores e Desenvolvedores</h2>
              <p className="text-gray-400 mb-10">Veja o que nossos usuários dizem sobre a plataforma Soneh.</p>
              <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl border border-gray-700">
                  <p className="text-lg italic text-gray-300">"A Soneh transformou a maneira como eu prototipo meus projetos de automação residencial. As atualizações OTA economizam um tempo absurdo!"</p>
                  <div className="mt-6">
                      <p className="font-bold text-white">Alexandre B.</p>
                      <p className="text-sm text-purple-400">Maker & Entusiasta de IoT</p>
                  </div>
              </div>
          </div>
        </section>

        {/* ===== Chamada Final para Ação ===== */}
        <section className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-white">Pronto para tirar suas ideias do papel?</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Crie sua conta e adicione seu primeiro dispositivo em minutos. A inovação está a apenas um clique de distância.
          </p>
          <div className="mt-8">
            <Link href="/dashboard" className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105">
              Comece Gratuitamente
            </Link>
          </div>
        </section>
      </main>

      {/* ===== Rodapé ===== */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Plataforma Soneh. Todos os direitos reservados.</p>
            <div className="mt-4 flex justify-center gap-6">
                <Link href="#" className="hover:text-white">Sobre</Link>
                <Link href="#" className="hover:text-white">Documentação</Link>
                <Link href="#" className="hover:text-white">Contato</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
