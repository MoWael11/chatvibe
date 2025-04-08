'use client';

import { Video, VideoOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { ActionTooltip } from '../action-tooltip';

export const ChatVideoButton = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get('video');

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || '',
      query: { video: !isVideo ? true : undefined },
    });

    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call';

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
