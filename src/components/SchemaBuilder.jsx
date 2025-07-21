import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Plus } from "lucide-react";

const defaultField = { key: "", type: "String", fields: [] };

function FieldSet({ nestIndex, control, register, getValues, fieldArrayName }) {
  const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

  return (
    <div className={`relative ${nestIndex > 0 ? "border-l-2 border-gray-200 pl-6 ml-4" : ""}`}>
      {fields.map((item, index) => {
        const path = `${fieldArrayName}[${index}]`;
        const type = getValues(`${path}.type`);

        return (
          <div key={item.id} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Field Key"
                {...register(`${path}.key`)}
                className="flex-grow max-w-[200px]"
              />

              <Controller
                control={control}
                name={`${path}.type`}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Field Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="String">String</SelectItem>
                      <SelectItem value="Number">Number</SelectItem>
                      <SelectItem value="Nested">Nested</SelectItem>
                      <SelectItem value="ObjectId">ObjectId</SelectItem>
                      <SelectItem value="Float">Float</SelectItem>
                      <SelectItem value="Boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <button
                type="button"
                className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 data-[state=checked]:bg-blue-600"
                role="switch"
                aria-checked="false"
                data-state="unchecked"
              >
                <span className="sr-only">Toggle</span>
                <span className="pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0 data-[state=checked]:translate-x-5" />
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-gray-500 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {type === "Nested" && (
              <div className="pl-4">
                <FieldSet
                  nestIndex={nestIndex + 1}
                  control={control}
                  register={register}
                  getValues={getValues}
                  fieldArrayName={`${path}.fields`}
                />
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant="default"
        className="mt-2 w-full justify-center bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => append({ ...defaultField })}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
    </div>
  );
}

export default function SchemaBuilder() {
  const { control, register, getValues } = useForm({ defaultValues: { fields: [] } });
  const [activeTab, setActiveTab] = useState("builder");

  const generateJSON = (fields) => {
    const json = {};
    fields.forEach((field) => {
      if (!field.key) return;
      if (field.type === "Nested") {
        json[field.key] = generateJSON(field.fields || []);
      } else {
        switch (field.type) {
          case "String":
            json[field.key] = "string";
            break;
          case "Number":
            json[field.key] = 0;
            break;
          case "ObjectId":
            json[field.key] = "objectId";
            break;
          case "Float":
            json[field.key] = 0.0;
            break;
          case "Boolean":
            json[field.key] = false;
            break;
          default:
            json[field.key] = "unknown";
        }
      }
    });
    return json;
  };

  const jsonOutput = generateJSON(getValues("fields"));

  return (
    <div className="min-h-screen flex flex-col bg-background text-gray-800 font-sans">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="json">JSON Output</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" id="builder">
            <FieldSet
              nestIndex={0}
              control={control}
              register={register}
              getValues={getValues}
              fieldArrayName="fields"
            />
          </TabsContent>

          <TabsContent value="json" id="json">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="absolute top-2 right-4 text-xs text-muted-foreground italic">Auto-generated JSON</div>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words overflow-x-auto font-mono">
                {JSON.stringify(jsonOutput, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}