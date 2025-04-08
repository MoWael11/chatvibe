import { useUploadThing } from '@/lib/uploadthing';
import { Cloud, File, FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';

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

        // url deprecated but faster :)
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
        }, 500);
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
