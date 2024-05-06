"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, SquarePenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { schema } from "./formSchema";

import { FormState, onSubmitAction } from "../../actions/formPosition";
import { Textarea } from "../ui/textarea";
import { SubmitButton } from "./SubmitButton";
import { useToast } from "../ui/use-toast";
import { Position } from "@/types/common";

interface PositionForm {
  position?: Position;
}

export function PositionForm({ position }: PositionForm) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(
    (prevState: FormState, data: FormData) =>
      onSubmitAction(prevState, data, position?.id),
    {
      message: "",
    }
  );

  const { toast } = useToast();

  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: position?.company || "",
      jobTitle: position?.jobTitle || "",
      contact: position?.contact || "",
      location: position?.location || "",
      description: position?.description || "",
      hourlyRate: position?.hourlyRate || 100,
      status: position?.status || "applied",
      ...(state?.fields ?? {}),
    },
  });

  useEffect(() => {
    if (state?.message === "success") {
      setOpen(false);
      toast({
        title: `Position successfuly added`,
      });
      form.reset();
    }
  }, [state?.message, toast, form]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
      <DialogTrigger asChild>
        <Button
          data-testid="positionDialogButton"
          variant={position ? "ghost" : "outline"}
          size="sm"
          onClick={() => setOpen(true)}
          className="ml-2"
        >
          {position ? (
            <SquarePenIcon />
          ) : (
            <>
              <PlusIcon className="mr-2" /> Add
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg h-[97vh] sm:h-[80vh]">
        <DialogHeader>
          <DialogTitle>Job application form</DialogTitle>
          <DialogDescription>
            Add job you applied you can have track of your applications.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Form {...form}>
              {state?.message !== "" &&
                !state.issues &&
                form.formState.isDirty && (
                  <div className="text-red-500">{state.message}</div>
                )}
              {state?.issues && (
                <div className="text-red-500">
                  <ul>
                    {state.issues.map((issue) => (
                      <li key={issue} className="flex gap-1">
                        <X fill="red" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <form ref={formRef} className="space-y-8" action={formAction}>
                <div className="overflow-y-scroll max-h-[60vh] p-1">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          Company name where you applied.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Job title</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          Job title where you applied.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          Where is company office?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Recruiter contact</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>Contact of recruiter.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Hourly rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Hourly rate you applied with.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Status of application</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          Status of application must be one of: applied,
                          interview, offer, rejected, pending..
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full mb-4">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="free to write notes, description .."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Job description or notes.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <SubmitButton />
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
