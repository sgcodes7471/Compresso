'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  { title: "Demi", price: "$5.99", projects: "1 Month" },
  { title: "Grande", price: "$20.99", projects: "6 Months", highlighted: true },
  { title: "Venti", price: "$40.99", projects: "1 Year" },
];

export default function Pricing() {
  return (
    <div className="flex flex-col items-center py-16">
      <h2 className="text-4xl font-bold">Pricing Plans</h2>
      <p className="text-gray-500 mt-4 text-lg">Choose the best plan for your needs.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className={`p-8 text-center h-[300px] w-[280px] ${plan.highlighted ? 'shadow-xl' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{plan.price}</p>
              <p className="text-gray-600 text-2xl mt-2">{plan.projects}</p>
              <Button className="mt-6 px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white">BUY NOW</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}