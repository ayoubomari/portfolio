import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { project, blogPost, contactFormEntries, newsLetterFormEntries } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faChartLine, faUserGroup, faFileText, faChartBar, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sql, gte, and, lt } from "drizzle-orm";

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

export default async function Page() {
    const user = await validateRequest()
    if (!user.user) {
        return redirect("/login");
    }

    const projectStats = await getCountAndPercentageChange(project);
    const blogPostStats = await getCountAndPercentageChange(blogPost);
    const contactFormStats = await getCountAndPercentageChange(contactFormEntries);
    const newsletterStats = await getCountAndPercentageChange(newsLetterFormEntries);

    return (
        <div className="min-h-screen py-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderCard("Total Projects", faChartLine, projectStats)}
                {renderCard("Blog Posts", faFileText, blogPostStats)}
                {renderCard("Form Entries", faUserGroup, contactFormStats)}
                {renderCard("Newsletter Entries", faChartBar, newsletterStats)}
            </div>
        </div>
    );
}

function renderCard(title: string, icon: any, stats: { count: number, percentageChange: number }) {
    const { count, percentageChange } = stats;
    const isPositive = percentageChange >= 0;
    const arrowIcon = isPositive ? faArrowUp : faArrowDown;
    const colorClass = isPositive ? "text-green-600" : "text-red-600";

    return (
        <div>
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
        </div>
    );
}