import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
export default async function Page() {
  const sessions = await auth();
  return (
    <div>
      {JSON.stringify(sessions)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button size={"lg"} type="submit">
          Signout
        </Button>
      </form>
    </div>
  );
}
