import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"; // Import CardHeader, CardTitle, CardDescription, CardContent
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const defaultField = { key: "", type: "String", fields: [] };

function FieldSet({ nestIndex, control, register, getValues, fieldArrayName }) {
  const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

  return (
    <div className="ml-4">
      {fields.map((item, index) => {
        const path = `${fieldArrayName}[${index}]`;
        const type = getValues(`${path}.type`);

        return (
          <Card key={item.id} className="p-4 mb-4 bg-gray-50">
            <CardHeader>
              <CardTitle>Field {index + 1}</CardTitle> {/* Added content for CardTitle */}
              <CardDescription>Configure your field settings.</CardDescription> {/* Added content for CardDescription */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Input placeholder="Field Key" {...register(`${path}.key`)} />

                <Controller
                  control={control}
                  name={`${path}.type`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="Nested">Nested</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => remove(index)}>Delete</Button>

                  {type === "Nested" && (
                    <Button onClick={() => append({ ...defaultField })}>
                      Add Nested
                    </Button>
                  )}
                </div>

                {type === "Nested" && (
                  <FieldSet
                    nestIndex={index + 1}
                    control={control}
                    register={register}
                    getValues={getValues}
                    fieldArrayName={`${path}.fields`}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button
        variant="outline"
        className="mt-2"
        onClick={() => append({ ...defaultField })}
      >
        Add Field
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
        json[field.key] = field.type === "String" ? "string" : 0;
      }
    });
    return json;
  };

  const jsonOutput = generateJSON(getValues("fields"));

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="json">JSON Output</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <FieldSet
            nestIndex={0}
            control={control}
            register={register}
            getValues={getValues}
            fieldArrayName="fields"
          />
        </TabsContent>

        <TabsContent value="json">
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}