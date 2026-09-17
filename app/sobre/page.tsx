import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mim | Fazendo Matemática",
};

const skills = [
  "Domínio de conteúdo matemático",
  "Planejamento de aulas",
  "Metodologias ativas",
  "Ensino baseado em projetos",
  "Gestão de sala de aula",
  "Resolução de problemas",
  "Comunicação",
];

const languages = [
  { name: "Português", level: "Nativo" },
  { name: "Inglês", level: "Avançado" },
  { name: "Francês", level: "Intermediário" },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Erik Proença</h1>
        <p className="mt-2 text-lg text-gray-500">
          Professor de Matemática, Física e Programação
        </p>
      </header>

      <section className="mb-10 rounded-lg border bg-white p-6">
        <p className="leading-relaxed text-gray-700">
          Educador especializado em Matemática e Tecnologia Educacional,
          dedicado a desenvolver currículos inovadores que integram
          pensamento matemático, computação e metodologias ativas. Acredito
          em criar experiências de aprendizagem transformadoras que preparam
          estudantes para os desafios do século XXI, promovendo literacia
          digital, raciocínio lógico e competências socioemocionais.
        </p>
      </section>

      <section className="mb-10 rounded-lg border border-blue-100 bg-blue-50 p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-900">
          Pesquisa em Mentalidades Matemáticas
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-blue-900">
          Faço parte de um time de pesquisa do Instituto Federal dedicado às{" "}
          <span className="font-semibold">Mentalidades Matemáticas</span>{" "}
          (Mathematical Mindsets), abordagem desenvolvida por{" "}
          <span className="font-semibold">Jo Boaler</span>, professora de
          educação matemática em Stanford e cofundadora do centro de
          pesquisas Youcubed.
        </p>
        <p className="text-sm leading-relaxed text-blue-900">
          A abordagem parte da ideia de que qualquer pessoa é capaz de
          aprender matemática em altos níveis, unindo descobertas da
          neurociência a uma mentalidade de crescimento: a crença de que a
          habilidade matemática se desenvolve com esforço, boas estratégias
          e apoio — não é um talento fixo com que se nasce. Na prática, isso
          significa priorizar representações visuais e criativas, conexões
          entre ideias e tarefas abertas, em vez de memorização isolada de
          fórmulas. É essa filosofia que orienta o desenho das atividades e
          dos jogos desta plataforma.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Formação acadêmica</h2>
        <div className="rounded-lg border bg-white p-5">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="font-semibold">
              Licenciatura em Matemática com Habilitação em Física
            </h3>
            <span className="text-xs text-gray-400">2007 - 2009</span>
          </div>
          <p className="text-sm text-gray-500">Faculdade de Taboão da Serra</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Habilidades</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Idiomas</h2>
        <div className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <span key={lang.name} className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{lang.name}</span>{" "}
              — {lang.level}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Contato</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href="mailto:erik.proenca2011@gmail.com"
            className="text-blue-600 hover:underline"
          >
            E-mail
          </a>
          <a
            href="https://linkedin.com/in/erikproenca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=5511986165932"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
