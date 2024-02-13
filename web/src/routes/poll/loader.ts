import { LoaderFunctionArgs } from "react-router-dom";
import { LoaderParams, PollByIdResponse } from ".";
import { http } from "../../lib/axios";

export async function loader({
  params,
}: LoaderFunctionArgs<LoaderParams>): Promise<{ data: PollByIdResponse }> {
  const { data } = await http.get<PollByIdResponse>(`/polls/${params.pollId}`);

  return { data };
}
