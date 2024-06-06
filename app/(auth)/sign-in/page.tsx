"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { AuthTokensResponse } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().max(16).min(8),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    axios
      .post<{ user: User; tokens: AuthTokensResponse }>(
        "/api/auth/sign-in",
        data
      )
      .then((res) => {
        // console.log(res.data.tokens.access.token);
        toast.success("Successfully Logged In");
        router.push("/");

        router.refresh();
      })
      .catch((err) => {
        toast.error(err.response.data.message || "some error occured");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your page</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex">
              <Link href="/forget-password">
                <Button variant={"link"} type="button">
                  <p>Forgot Password?</p>
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button variant={"link"} type="button">
                  <p>{`Don't have account? Sign up`}</p>
                </Button>
              </Link>
            </div>
            <Button size={"lg"} type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
