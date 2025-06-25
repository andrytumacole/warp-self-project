"use client";
import { useQuery } from "convex/react"; //used for queries similar ish to firebase but closer to isar
import { api } from "../../../convex/_generated/api"; //get the convex api ref

function TestPage() {
  // "sample" is defined from the filename created in convex folder
  // get is the method defined inside the "sample" folder
  // remember that get uses a query that is why you use useQuery
  const data = useQuery(api.sample.get);
  return (
    <div className="flex flex-col">
      <h1>This is a test page!!</h1>
      {data?.map(({ _id, text }) => {
        return <div key={_id}>{text}</div>;
      })}
    </div>
  );
}

export default TestPage;
