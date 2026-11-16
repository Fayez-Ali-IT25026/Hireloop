import { Button } from "./ui/button";
import { Lock } from "lucide-react";

interface CheckoutPageProps {
  price: number;
}

const CheckoutPage = ({ price }: CheckoutPageProps) => {
  return (
    <form action="/api/checkout_sessions" method="POST">
      <Button
        type="submit"
        className="mt-5 h-11 w-full gap-2 rounded-xl bg-indigo-600 font-semibold text-white"
      >
        <Lock className="size-4" />
        Pay ${price}
      </Button>
    </form>
  );
};

export default CheckoutPage;









// import React from 'react';
// import { Button } from './ui/button';

// const CheckoutPage = async ({ searchParams , price}: { searchParams: Promise<{ canceled?: string }> ,price:number}) => {

// const { canceled } = await searchParams

//     if (canceled) {
//         console.log(
//             'Order canceled -- continue to shop around and check out when you\'re ready.'
//         )
//     }


//     return (
//         <form action="/api/checkout_sessions" method="POST">
//       <section>
//         <Button
//           type="submit"
//           className="mt-5 h-11 w-full gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
//         >
//           <Lock className="size-4" />
//           Pay ${price}
//         </Button>
//       </section>
//     </form>
//     );
// };

// export default CheckoutPage;