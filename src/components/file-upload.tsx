import { useState } from 'react';
import { useToast } from './ui/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import Dropzone from 'react-dropzone';
import { Cloud, File, FileIcon, Loader2, X } from 'lucide-react';
import { Progress } from './ui/progress';
import { Dialog, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { DialogContent } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProgressIndicator } from '@radix-ui/react-progress';

export const FileUpload = ({
  endpoint,
  onChange,
  value,
}: {
  endpoint: 'messageFile' | 'serverImage';
  onChange: (url?: string) => void;
  value?: string;
}) => {
  const fileType = value?.split('.').pop();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const { startUpload } = useUploadThing(endpoint);

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    return interval;
  };

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20 m-auto">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 m-auto">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value.split('/').pop()}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        // handle file uploading
        const res = await startUpload(acceptedFile);

        if (!res)
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive',
          });

        const [fileRespone] = res;

        const { key, url } = fileRespone;
        if (!key)
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive',
          });

        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          onChange(url);
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="w-6 h-6 text-zinc-500 mb-2" />{' '}
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                {endpoint === 'serverImage' && <p className="text-xs text-zinc-500">image (up to 4 MB)</p>}
                {endpoint === 'messageFile' && <p className="text-xs text-zinc-500">image or PDF (up to 4 MB)</p>}
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">{acceptedFiles[0].name}</div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    indicatorColor={uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}

              <input {...getInputProps()} className="hidden"></input>
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
