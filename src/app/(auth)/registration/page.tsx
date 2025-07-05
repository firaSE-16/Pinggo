"use client"
import React from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod" 
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useAuth, useUser } from "@clerk/nextjs";
 
const registrationSchema = z.object({
  username:z.string().min(2).max(50),
  email:z.string().email(),
  password:z.string().min(7).max(50),
  fullName:z.string().min(2).max(100),
  bio:z.string().min(2).max(100).optional(),
  avatarUrl:z.string().url().optional() 
})

const Page = () => {

  const { user } = useUser();
const form = useForm<z.infer<typeof registrationSchema>>({
  resolver: zodResolver(registrationSchema),
  defaultValues: {
    username: "",
    email: user?.emailAddresses[0].emailAddress,
    password: "",
    fullName: "",
    bio: "",
    avatarUrl: "",
  },
});

function onSubmit(values:z.infer<typeof registrationSchema>){
  
}


  return <div className="w-full min-h-screen flex flex-col gap-5 p-20  items-center">

    <h1 className="text-3xl font-bold font-mono">Create your Pinggo account</h1>
    <p>It only takes a minute. Let's get you started.</p>
    
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full grid md:grid-cols-2 md:grid-rows-3 gap-x-10">
        <FormField control={form.control}
        name="username"
        render={(({field})=>(
          <FormItem className="h-36">
            <FormLabel>User name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your username" {...field}/>
            </FormControl>
          </FormItem>
        ))}/>
        <FormField 
         control={form.control}
         name="password"
         render={({field})=>(
          <FormItem className="h-36">
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input placeholder="*******" {...field}/>
            </FormControl>
           
            <FormMessage/>
          </FormItem>

         )}
        />
        <FormField 
         control={form.control}
         name="fullName"
         render={({field})=>(
          <FormItem className="h-36">
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field}/>
            </FormControl>
            
            <FormMessage/>
          </FormItem>

         )}
        />
        <FormField 
         control={form.control}
         name="bio"
         render={({field})=>(
          <FormItem className="h-36">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Input placeholder="Tell us about yourself" {...field}/>
            </FormControl>
            
            <FormMessage/>
          </FormItem>

         )}
        />

        <FormField
  control={form.control}
  name="avatarUrl"
  render={({ field }) => (
    <FormItem className="h-36">
      <FormLabel>Upload Avatar</FormLabel>
      <FormControl>
        <UploadDropzone<OurFileRouter>
          endpoint="avatarUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0].url;
            field.onChange(url); // update avatarUrl in form
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error.message);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>







<Button type="submit" className="rounded-[10px] text-white mt-24 cursor-pointer">Register</Button>
                </form>
      </Form>
      
    </div>
    <p className="mt-20">Need help? [Contanct Support] or [FAQ]</p>
    </div>

};

export default Page;


