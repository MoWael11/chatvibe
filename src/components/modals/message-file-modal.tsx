'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-sotre';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import qs from 'query-string';
import { useEffect } from 'react';

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is required.',
  }),
});

export const MessageFileModal = () => {
  const { refresh } = useRouter();
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'messageFile';

  type formType = z.infer<typeof formSchema>;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  });

  const { apiUrl, query } = data;

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isLoading },
  } = form;

  const [fileUrl] = watch(['fileUrl']);

  const onSubmit = async (values: formType) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || ``,
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      reset();
      refresh();
      handleColse();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (fileUrl) {
      form.handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl]);

  const handleColse = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleColse}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Add an attachment</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">Send a file as message</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-0 w-full">
                      <FormControl>
                        <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
