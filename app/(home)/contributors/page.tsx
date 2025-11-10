import Link from "next/link";

const CONTRIBUTORS = [
  { name: "Jackson Clark", link: "https://hacksonclark.github.io/", role: "Lead" },
  { name: "Yiming Su", link: "https://yimingsu01.github.io/", role: "Co-Lead" },
  { name: "Saad Mohammad Rafid Pial", link: "https://saadmrp1038.github.io/", role: "Contributor" },
  { name: "Bohan Cui", link: "./contributors", role: "Contributor" },
  { name: "Jiaqi Huang", link: "https://777lefty.github.io/", role: "Contributor" },
  { name: "Lily Gniedziejko", link: "https://lilygniedz.me/", role: "Contributor" },
  { name: "Yinfang Chen", link: "https://yinfangchen.github.io/", role: "Advisor" },
  { name: "Tianyin Xu", link: "https://tianyin.github.io/", role: "Advisor" },
  { name: "Brighten Godfrey", link: "https://pbg.cs.illinois.edu/", role: "Advisor" },
  { name: "And many more...", link: "https://github.com/SREGym/SREGym/graphs/contributors" },
];

export default function TeamPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-6 sm:pt-12">
      <div className="flex w-full max-w-7xl flex-1 flex-col">
        <h2 className="mb-6 font-mono text-4xl tracking-tighter sm:mb-12">
          Contributors
        </h2>
        <p className="text-muted-foreground mb-12 font-mono text-base/relaxed sm:text-base/relaxed">
          We're looking for more contributors! If you are interested in
          collaborating please see our{" "}
          <Link
            href="/docs/contributing"
            className="text-foreground underline underline-offset-4"
          >
            contributing page
          </Link>
          .
        </p>
        <div className="-mx-4 grid grid-cols-1 items-stretch sm:mx-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CONTRIBUTORS.map(({ name, link, role }, index) => (
            <Link href={link} key={name} className="flex flex-col">
              <div className="bg-card hover:bg-sidebar dark:hover:bg-accent -mb-px flex-1 border-y p-4 transition-all duration-200 sm:-mr-px sm:border-x">
                <p className="mb-1 font-mono text-lg">{name}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {role}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:mt-12">
          <h2 className="mb-6 font-mono text-2xl tracking-tighter">
            Acknowledgements
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground font-mono text-sm/relaxed">
              This project is generously supported by a Slingshot grant from the Laude Institute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
