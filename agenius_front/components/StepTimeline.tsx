/*import { Offer } from "@/types/offer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";

interface Props {
  offer: Offer;
}

export const StepTimeline = ({ offer }: Props) => {
  if (!offer.steps?.length) {
    return (
      <p className="text-sm text-gray-500">
        Aucune étape n’est définie pour cette offre.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          Timeline du processus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offer.steps.map((step, index) => {
            const stepDate = step.completedAt ? new Date(step.completedAt) : null;

            return (
              <div
                key={index}
                className="relative flex items-start gap-4 p-6 rounded-xl border-2 border-green-200 hover:shadow-md transition-all duration-300"
              >
                {/* Timeline line }
                {index < offer.steps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200" />
                )}

                {/* Step icon }
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="absolute -inset-1 bg-green-100 rounded-full -z-10" />
                  </div>
                </div>

                {/* Step content }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-green-900">
                      {step.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-sm font-medium bg-green-100 text-green-800"
                    >
                      Terminé
                    </Badge>
                  </div>

                  

                  {stepDate && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Terminé le{" "}
                        {stepDate.toLocaleDateString("fr-FR")} à{" "}
                        {stepDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
*/import { Offer } from "@/types/offer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";

interface Props {
  offer: Offer;
}

export const StepTimeline = ({ offer }: Props) => {
  if (!offer.steps?.length) {
    return (
      <p className="text-sm text-gray-500">
        Aucune étape n’est définie pour cette offre.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          Timeline du processus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offer.steps.map((step, index) => {
            const stepDate = step.completedAt ? new Date(step.completedAt) : null;

            return (
              <div
                key={index}
                className="relative flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:shadow-sm transition-all duration-300 bg-white"
              >
                {/* Timeline line */}
                {index < offer.steps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300" />
                )}

                {/* Step icon */}
                <div className="flex-shrink-0 mt-1">
                  <div className="relative">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="absolute -inset-1 bg-green-100 rounded-full -z-10" />
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-sm font-medium bg-green-100 text-gray-800"
                    >
                      Terminé
                    </Badge>
                  </div>

                 

                  {stepDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Terminé le{" "}
                        {stepDate.toLocaleDateString("fr-FR")} à{" "}
                        {stepDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
