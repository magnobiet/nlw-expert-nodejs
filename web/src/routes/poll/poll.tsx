/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { LoaderData, Option, PollByIdResponse } from ".";
import { Container } from "../../components/Container";
import { Header } from "../../components/Header";
import { SocketStatus } from "../../components/SocketStatus";
import { http } from "../../lib/axios";

export default function Poll() {
  const { data } = useLoaderData() as LoaderData;
  const [pageData, setPageData] = useState<PollByIdResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { lastMessage, readyState } = useWebSocket(socketUrl);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setSocketUrl(`ws://localhost:3333/polls/${data.id}/results`);

    setPageData(data);
  }, [data]);

  useEffect(() => {
    const dataUpdated: PollByIdResponse = { ...data };

    if (lastMessage?.data) {
      const optionUpdated: Option = JSON.parse(lastMessage.data);

      dataUpdated.options = dataUpdated.options.map((option) => {
        if (optionUpdated.pollOptionId === option.id) {
          option.votes = optionUpdated.votes;
        }

        return option;
      });

      setPageData(dataUpdated);
    }
  }, [data, lastMessage]);

  async function handleClick(
    pollId: string,
    pollOptionId: string
  ): Promise<void> {
    if (!token) {
      return;
    }

    setIsLoading(true);

    await http.post(
      `/polls/${pollId}/votes`,
      { pollOptionId },
      { headers: { Authorization: token } }
    );

    setIsLoading(false);
  }

  return (
    <Container>
      <Header title={pageData?.title ?? ""} />

      <SocketStatus readyState={readyState}></SocketStatus>

      <input
        type="text"
        className="fixed left-8 bottom-8 px-4 py-2 rounded-lg text-slate-950 text-center min-w-96"
        placeholder="User ID"
        onChange={({ target: { value } }) => setToken(value)}
      />

      <ul className="flex flex-col gap-4">
        {pageData?.options?.map((option) => {
          return (
            <li
              key={option.id}
              className="flex gap-4 items-center justify-between"
            >
              <p className="flex flex-col font-bold">
                {option.title}

                <span className="text-sm text-slate-400 font-normal">
                  {option.votes} votes
                </span>
              </p>

              <button
                type="button"
                disabled={isLoading || !token}
                className="px-2 py-1 border border-lime-600 bg-lime-950 hover:bg-lime-900 rounded"
                onClick={() => handleClick(data.id, option.id)}
              >
                Vote
              </button>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
