import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import RenderTable from "@/components/wedges/tables/RenderTable";
import { tag } from "@/db/schema";
import { validateRequest } from "@/lib/auth/validate-request";
import { getRowsFromTableWithLimit } from "@/lib/tables/getrows";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await validateRequest();
  if (!user.user) {
    return redirect("/login");
  }

  const tags = await getRowsFromTableWithLimit(tag);

  return (
    <div className="min-h-screen py-8">
      {/*hero section*/}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Tags</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tags</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Link href="/dashboard/tags/new">
            <Button size="lg" className="w-full md:w-auto">
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </Link>
        </div>
      </div>

      {/*table section*/}
      <RenderTable
        title="Recent Tags"
        buttons={[]}
        data={tags}
        tableType="tag"
      />
    </div>
  );
}
