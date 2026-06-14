import { redirect } from "next/navigation";

// /mint is an alias for the first step of the wizard.
export default function MintIndex() {
  redirect("/mint/details");
}
