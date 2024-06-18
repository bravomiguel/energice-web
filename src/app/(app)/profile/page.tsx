import DeleteAccountBtn from "@/components/delete-account-btn";
import SignOutBtn from "@/components/sign-out-btn";
import StartPlungeBtn from "@/components/start-plunge-btn";

export default async function Page() {
  return (
    <main className="h-screen flex flex-col gap-4 py-4">
      <StartPlungeBtn />
      <SignOutBtn />
      <DeleteAccountBtn />
    </main>
  )
}
