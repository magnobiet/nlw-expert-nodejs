import { Link, useLoaderData } from "react-router-dom";
import { Container } from "../../components/Container";
import { Header } from "../../components/Header";
import { http } from "../../lib/axios";

export async function loader({ params }) {
  const { data } = await http.get("/polls");

  return { data };
}

export default function Root() {
  const { data } = useLoaderData();

  return (
    <Container>
      <Header title="Polls" />

      <ul className="flex flex-col gap-4">
        {data.map((poll) => (
          <li key={poll.id}>
            <Link
              to={`poll/${poll.id}`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded block"
            >
              {poll.title}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
