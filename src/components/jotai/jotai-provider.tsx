import { Provider } from "jotai";

interface JotaiProviderProps {
  children: React.ReactNode;
}

function JotaiProvider(props: Readonly<JotaiProviderProps>) {
  const { children } = props;
  return <Provider>{children}</Provider>;
}

export default JotaiProvider;
