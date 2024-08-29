import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "./actions";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function Page() {
  return (
    <>
		<Header />
		<div className="flex min-h-screen">
			<div className="w-full md:w-1/2 p-10 my-auto">
				<div className="max-w-md grow mx-auto">
				<div className="mb-8">
					<Image src="/assets/images/icons/logo.webp" alt="logo" width={50} height={50} />
				</div>
				<h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>
				<form action={login} className="space-y-4">
					<div>
						<label htmlFor="username" className="block text-sm font-medium mb-1">
							Username
						</label>
						<Input type="string" id="username" name="username" required />
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1">
							Password
						</label>
						<Input type="password" id="password" name="password" required />
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Checkbox id="remember" />
							<label htmlFor="remember" className="ml-2 text-sm">
							Remember me
							</label>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Sign in
					</Button>
				</form>
				</div>
			</div>
			<div className="hidden md:block relative w-1/2">
				<Image src="/assets/images/contents/login-background.webp" alt="login" layout="fill" className="object-cover" />
			</div>
		</div>
		<Footer />
	</>
  );
}