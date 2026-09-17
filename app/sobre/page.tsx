import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre mim | Fazendo Matemática",
};

const experiences = [
  {
    company: "Maple Bear Santana",
    role: "Professor de Matemática",
    period: "01/2025 - Atual",
    highlights: [
      "Ensino de matemática para alunos do ensino fundamental e médio, utilizando metodologias ativas.",
      "Desenvolvimento de planos de aula e projetos práticos aplicando os conceitos em situações reais.",
      "Implementação de atividades interativas e colaborativas para estimular pensamento crítico e criatividade.",
    ],
  },
  {
    company: "Colégio 14 de Julho",
    role: "Professor de Física e Matemática Financeira",
    period: "01/2024 - 07/2026",
    highlights: [
      "Itinerário Formativo de Matemática no Ensino Médio, com foco em Matemática Financeira e Geometria.",
      "Simulações de investimentos financeiros para ensinar o funcionamento do mercado aos alunos.",
      "Planos de aula que combinam teoria e prática, com tecnologias educacionais modernas.",
    ],
  },
  {
    company: "Maple Bear Jardins",
    role: "Professor de Programação",
    period: "01/2023 - 12/2024",
    highlights: [
      "Ensino de programação para diferentes faixas etárias, com foco em lógica, algoritmos e Python.",
      "Organização de eventos e workshops para competições de programação e feiras de ciências.",
    ],
  },
];

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
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Pesquisa: </span>
          Integro o grupo de pesquisa do Instituto Federal sobre{" "}
          <span className="font-semibold">Mentalidades Matemáticas</span>{" "}
          (Mathematical Mindsets), abordagem baseada no trabalho de Jo
          Boaler que orienta o desenho das atividades e jogos desta
          plataforma.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Experiência</h2>
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.company} className="rounded-lg border bg-white p-5">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold">{exp.role}</h3>
                <span className="text-xs text-gray-400">{exp.period}</span>
              </div>
              <p className="mb-2 text-sm text-gray-500">{exp.company}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
