import { Button } from "@/app/ui-components/button";
// import { fetchFilteredTickets } from "@/lib/data";
import prisma from "@/lib/database/prisma/prisma";

export default function CategorisationButton({
  ticketsList1 }: { ticketsList1: typeof prisma.ticket[];

}) {
  const handleClick = () => {

  };
  return (
    <Button
      title="Click to activate A.I."
      onClick={categorizeTickets1}> A.I Categorization, Filtering
    </Button>
  );
}
async function categorizeTickets1() {

}
