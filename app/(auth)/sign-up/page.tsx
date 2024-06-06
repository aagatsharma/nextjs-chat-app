"use client";

import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { userContext } from "@/providers/AuthProvider";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import getCurrentUser from "@/actions/getCurrentUser";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3).max(16),
  email: z.string().email(),
  password: z.string().max(16).min(8),
});

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const currentUser = useContext(userContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    axios
      .post<{ user: User; tokens: AuthTokensResponse }>(
        "/api/auth/sign-up",
        data
      )
      .then((res) => {
        // console.log(res.data.tokens.access.token);
        toast.success("User successfully created.");
        router.push("/");

        router.refresh();
        // res.data.tokens.access.token
      })
      .catch((err) => {
        toast.error(err.response.data.message || "some error occured");
        console.error(err.response.data.message || "some error occured");
      })
      .finally(() => setLoading(false));
    // signIn('credentials', { ...data, redirect: false })
    //   .then((callback) => {
    //     if (callback?.error) {
    //       toast.error(callback.error);
    //     } else if (callback?.ok) {
    //       router.refresh();
    //     }
    //   })
    //   .catch((err) => toast.error(err?.message))
    //   .finally(() => setLoading(false));
  };

  return (
    <Card className="w-[370px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account for your page</CardDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <Input placeholder="Enter your Name" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
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

            <Link href="/sign-in" className="py-2">
              <Button variant={"link"} type="button">
                <p>Already have an account? Sign in</p>
              </Button>
            </Link>

            <Button size={"lg"} type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3"></CardFooter>
    </Card>
  );
}
