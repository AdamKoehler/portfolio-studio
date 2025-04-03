import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectType } from "@/app/dashboard/update/page";

type Params = {
  params: { username: string };
};

export default async function PortfolioPage({ params }: Params) {
  const { username } = params;

  // Fetch the portfolio based on the username
  const portfolio = await prisma.portfolio.findUnique({
    where: { ownerUsername : username },
    include: { projects: true },
  });

  if (!portfolio) return notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">{portfolio.ownerUsername}'s Portfolio</h1>
      <p>{portfolio.aboutMe}</p>

      <h2 className="text-2xl font-bold mt-6">Projects</h2>
      <ul>
        {portfolio.projects.map((project: ProjectType) => (
          <li key={project.id} className="mt-4">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
