import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { project, blogPost, contactFormEntries, newsLetterFormEntries, blogPostTag, projectTag, blogPostTechnology, projectTechnology, tag, technology } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faProjectDiagram, faComments, faBlog, faEnvelope, faArrowUp, faArrowDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sql, gte, and, lt, SQL, desc, eq } from "drizzle-orm";
import Link from "next/link";
import AreaChartComponent from "@/components/wedges/AreaChart";
import DonutChart from "@/components/wedges/DonutChart";

// this is for cout and percentage tables
async function getCountAndPercentageChange(table: typeof project | typeof blogPost | typeof contactFormEntries | typeof newsLetterFormEntries) {
    const now = new Date();
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);



    const lastMonthCount = await db.select({ count: sql<number>`count(*)` })
        .from(table)
        .where(
            and(
                gte(table.createdAt, firstDayOfLastMonth),
                lt(table.createdAt, firstDayOfMonth),
            )
        );

    const currentMonthCount = await db.select({ count: sql<number>`count(*)` })
        .from(table)
        .where(
            gte(table.createdAt, firstDayOfMonth),
        );

    const prevCount = lastMonthCount[0].count;
    console.log("prevCount:", prevCount);
    const count = currentMonthCount[0].count;
    console.log("count:", count);
    const percentageChange = prevCount !== 0 ? ((count - prevCount) / prevCount) * 100 : 0;

    return { count, percentageChange };
}

// this is for area charts
async function getMonthlyCounts(dataKey: string, table: typeof project | typeof blogPost | typeof contactFormEntries | typeof newsLetterFormEntries) {
    const now = new Date();
    const currentYear = new Date(now.getFullYear(), 0, 1);
    const monthlyCounts: { month: string; [key: string]: number | string; }[] = [];

    for (let i = 0; i < 12; i++) {
        const firstDayOfMonth = new Date(currentYear.getFullYear(), currentYear.getMonth() + i, 1);
        const lastDayOfMonth = new Date(currentYear.getFullYear(), currentYear.getMonth() + i + 1, 1);

        const count = await db.select({ count: sql<number>`count(*)` })
            .from(table)
            .where(
                and(
                    gte(table.createdAt, firstDayOfMonth),
                    lt(table.createdAt, lastDayOfMonth),
                )
            );

        monthlyCounts.push({
            month: firstDayOfMonth.toLocaleString('default', { month: 'long' }),
            [dataKey]: count[0]?.count || 0, // Use computed property name
        });
    }

    console.log("monthlyCounts:", monthlyCounts);

    return monthlyCounts;
}

// this is for donut charts
async function getTop5CountsByTable<T extends typeof blogPostTag | typeof projectTag | typeof blogPostTechnology | typeof projectTechnology>(
    table: T,
    column: keyof T['_']['columns']
) {
    const columnRef = table[column as keyof typeof table];

    const countAlias = 'count';
    const countExpression = sql<number>`count(${columnRef})`.as(countAlias);


    const top5Counts = await db
        .select({
            id: columnRef as unknown as SQL<number>,
            [countAlias]: countExpression
        })
        .from(table)
        .groupBy(columnRef as unknown as SQL<string>)
        .orderBy(desc(countExpression))
        .limit(5);

    console.log("top5Counts:", top5Counts);
    return top5Counts as { id: number; count: number }[];
}


async function getAllTop5Counts() {
    // Fetch data
    const blogPostTags = await getTop5CountsByTable(blogPostTag, "tagId");
    const projectTags = await getTop5CountsByTable(projectTag, "tagId");
    const blogPostTechnologies = await getTop5CountsByTable(blogPostTechnology, "technologyId");
    const projectTechnologies = await getTop5CountsByTable(projectTechnology, "technologyId");

    // Combine and sort tags
    const combinedTags = await [...blogPostTags, ...projectTags]
        .reduce(async (accPromise, curr, o) => {
            const acc = await accPromise;
            const existingItem = acc.find(item => Number(item.id) === curr.id);
            if (existingItem) {
                existingItem.count += curr.count;
            } else {
                // search for names by id
                const [tagResult] = await db
                    .select({ name: tag.value })
                    .from(tag)
                    .where(eq(tag.id, curr.id));

                acc.push({ 
                    id: curr.id, 
                    name: tagResult?.name.replace(/[+\-.,'" 0-9]/g, '-') || 'Unknown',
                    count: curr.count, 
                    fill: `var(--color-${tagResult?.name.replace(/[+\-.,'" 0-9]/g, '-')})`
                });
            }
            return acc;
        }, Promise.resolve([] as { id: number; name: string; count: number; fill: string }[]));

    const topTags = combinedTags
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Combine and sort technologies
    const combinedTechnologies = await [...blogPostTechnologies, ...projectTechnologies]
        .reduce(async (accPromise, curr, o) => {
            const acc = await accPromise;
            const existingItem = acc.find(item => item.id === curr.id);
            if (existingItem) {
                existingItem.count += curr.count;
            } else {
                // search for names by id
                const [techResult] = await db
                    .select({ name: technology.name })
                    .from(technology)
                    .where(eq(technology.id, curr.id));

                acc.push({ 
                    id: curr.id, 
                    name: techResult?.name.replace(/[+\-.,'" 0-9]/g, '-') || 'Unknown',
                    count: curr.count, 
                    fill: `var(--color-${techResult?.name.replace(/[+\-.,'" 0-9]/g, '-')})`
                });
            }
            console.log("acc:", acc);
            return acc;
        }, Promise.resolve([] as { id: number; name: string; count: number; fill: string }[]));

    const topTechnologies = combinedTechnologies
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return { 
        topTags,
        topTechnologies
    };
}

export default async function Page() {
    const user = await validateRequest()
    if (!user.user) {
        return redirect("/login");
    }

    const projectStats = await getCountAndPercentageChange(project);
    const blogPostStats = await getCountAndPercentageChange(blogPost);
    const contactFormStats = await getCountAndPercentageChange(contactFormEntries);
    const newsletterStats = await getCountAndPercentageChange(newsLetterFormEntries);


    const contactFormMonthlyCounts = await getMonthlyCounts("Messages", contactFormEntries);
    const newsletterMonthlyCounts = await getMonthlyCounts("emails", newsLetterFormEntries);
    const allMonthlyCounts = contactFormMonthlyCounts.map((element, i) => ({ emails: newsletterMonthlyCounts[i].emails, ...element }));

    const { topTechnologies, topTags } = await getAllTop5Counts();

    return (
        <div className="min-h-screen py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderCard("Total Projects", faProjectDiagram, projectStats, "/dashboard/projects")}
                {renderCard("Blog Posts", faBlog, blogPostStats, "/dashboard/blog-posts")}
                {renderCard("Form Entries", faComments, contactFormStats, "/dashboard/contact-form-entries")}
                {renderCard("Newsletter Entries", faEnvelope, newsletterStats, "/dashboard/newsletter-entries")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderAreaChart("Opportunities", "The number of messages and emails in the last 12 months", "Messages", "emails", allMonthlyCounts)}
                {rederDonutChart("Technology", "Top Technologies used", topTechnologies)}
                {rederDonutChart("Tags", "Top Tags mentioned", topTags)}
            </div>
        </div>
    );
}

function renderCard(title: string, icon: IconDefinition, stats: { count: number, percentageChange: number }, link?: string) {
    const { count, percentageChange } = stats;
    const isPositive = percentageChange >= 0;
    const arrowIcon = isPositive ? faArrowUp : faArrowDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";

    return (
        <div>
            <Link href={link || "#"}>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <FontAwesomeIcon icon={icon} className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className={`flex items-center ${colorClass}`}>
                            <FontAwesomeIcon icon={arrowIcon} className="h-3 w-3 mr-1" />
                            <span className="text-sm font-medium">
                                {Math.abs(percentageChange).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </Link>
        </div>
    );
}



function renderAreaChart(title: string, subTitle: string, dataKey1: string, dataKey2: string, contactFormMonthlyCounts: { month: string; [key: string]: number | string; }[]) {
    return (
        <AreaChartComponent title={title} subTitle={subTitle} data={contactFormMonthlyCounts} dataKey1={dataKey1} dataKey2={dataKey2} />
    );
}


function rederDonutChart(title: string, subTitle: string, data: { name: string; count: number }[]) {
    return (
        <DonutChart title={title} subTitle={subTitle} data={data} chartLabels={data.map((d) => d.name)} />
    );
}