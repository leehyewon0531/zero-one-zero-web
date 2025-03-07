'use client';

import { VoteInfo, getVoteListApi } from '@/apis/api';
import VoteMenu from '@/components/VoteMenu';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VoteDetailPage() {
  const [voteInfo, setVoteInfo] = useState<VoteInfo>({
    voteId: 0,
    voteCreator: '',
    voteTitle: '',
    voteDescription: '',
    selectList: [],
  });
  const [selectedBtnIndex, setSelectedBtnIndex] = useState<number | null>(null);
  const [selectedVote, setSelectedVote] = useState<number | null>(null);

  const router = useRouter();

  const selectVote = (voteId: number) => {
    setSelectedBtnIndex(voteId);
    setSelectedVote(voteId);
  };

  const fetchVotes = async () => {
    try {
      const voteList = await getVoteListApi();
      setVoteInfo(voteList);
    } catch (error) {
      /** @todo 에러 핸들링 */
      console.error(error);
    }
  };

  const onSubmitClick = () => {
    if (selectedVote === null) {
      return;
    }
    const { voteId } = voteInfo;
    /** @todo 버튼 눌렀을 때 필요한 데이터를 서버로 넘기기 */
    console.log(voteId, selectedVote);
    // 임시 코드
    router.push('/result');
  };

  useEffect(() => {
    // 로딩 UI 표현을 위해 0.5초 딜레이 추가
    const timeoutId = setTimeout(() => {
      fetchVotes();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="relative h-48 flex flex-col h-screen justify-evenly m-10 my-10 py-10 px-8 ">
      {voteInfo.selectList.length === 0 ? (
        <>
          <h1 className="w-full text-2xl text-center mb-4">투표도장에 잉크를 꼼꼼히 바르고 있습니다....</h1>
          <Image width={500} height={500} src="/image/vote.png" alt="vote" />
        </>
      ) : (
        <>
          <h1 className="w-full text-2xl text-center mb-4">{voteInfo?.voteTitle}</h1>
          <ul className="w-full flex flex-col justify-evenly gap-4">
            {voteInfo.selectList.map(({ voteId, voteLabel }, idx, origin) => {
              return (
                <li
                  key={voteId}
                  onClick={() => selectVote(voteId)}
                  className={clsx(
                    idx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                    idx === origin.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                    selectedBtnIndex === voteId ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200',
                    'relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6',
                  )}
                >
                  <div className="flex flex-1 justify-evenly">{voteLabel}</div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onSubmitClick}
          >
            투표
          </button>
          <div className="flex" style={{ position: 'absolute', bottom: '13%', width: '30rem' }}>
            <VoteMenu share={true} />
          </div>
        </>
      )}
    </main>
  );
}
