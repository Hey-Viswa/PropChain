"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  propertyDetailsSchema,
  type PropertyDetailsFormValues,
} from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const labelClass =
  "block text-label-sm text-on_surface_variant dark:text-[#9ba3b8] mb-1.5 font-medium";
const errorClass = "text-[0.7rem] text-error mt-1 block";

interface PropertyDetailsFormProps {
  defaultValues?: Partial<PropertyDetailsFormValues>;
  onSubmit: (data: PropertyDetailsFormValues) => void;
}

export default function PropertyDetailsForm({
  defaultValues,
  onSubmit,
}: PropertyDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PropertyDetailsFormValues>({
    resolver: zodResolver(propertyDetailsSchema),
    defaultValues: defaultValues as PropertyDetailsFormValues,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 xl:space-y-6">
      {/* ULPIN — full width */}
      <div>
        <label className={labelClass}>
          ULPIN <span className="text-error">*</span>
        </label>
        <Input
          {...register("ulpin")}
          placeholder="MH0123456789"
          className={cn(errors.ulpin && "border-error")}
        />
        {errors.ulpin && (
          <span className={errorClass}>{errors.ulpin.message}</span>
        )}
      </div>

      {/* Address — full width */}
      <div>
        <label className={labelClass}>
          Property Address <span className="text-error">*</span>
        </label>
        <Textarea
          {...register("address")}
          rows={2}
          placeholder="12, Shivaji Nagar, Pune, Maharashtra"
          className={cn(errors.address && "border-error")}
        />
        {errors.address && (
          <span className={errorClass}>{errors.address.message}</span>
        )}
      </div>

      {/* State + District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
        <div>
          <label className={labelClass}>
            State <span className="text-error">*</span>
          </label>
          <Input
            {...register("state")}
            placeholder="Maharashtra"
            className={cn(errors.state && "border-error")}
          />
          {errors.state && (
            <span className={errorClass}>{errors.state.message}</span>
          )}
        </div>
        <div>
          <label className={labelClass}>
            District <span className="text-error">*</span>
          </label>
          <Input
            {...register("district")}
            placeholder="Pune"
            className={cn(errors.district && "border-error")}
          />
          {errors.district && (
            <span className={errorClass}>{errors.district.message}</span>
          )}
        </div>
      </div>

      {/* Area + Property Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-5">
        <div>
          <label className={labelClass}>
            Area (sq ft) <span className="text-error">*</span>
          </label>
          <Input
            {...register("area")}
            type="number"
            placeholder="1200"
            className={cn(errors.area && "border-error")}
          />
          {errors.area && (
            <span className={errorClass}>{errors.area.message}</span>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Property Type <span className="text-error">*</span>
          </label>
          <select
            {...register("type")}
            className={cn(
              "flex w-full bg-surface_container_highest dark:bg-[#2a3347] dark:text-[#e8eaf0] dark:border-[#2a3347] dark:focus:border-[#6b9eff] rounded-md border-0 border-b border-outline_variant/20",
              "focus:border-primary focus-visible:outline-none",
              "px-4 py-3 text-body-md text-on_surface dark:text-[#e8eaf0] cursor-pointer transition-colors",
              errors.type && "border-error"
            )}
          >
            <option value="">Select type…</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural">Agricultural</option>
          </select>
          {errors.type && (
            <span className={errorClass}>{errors.type.message}</span>
          )}
        </div>
      </div>

      {/* Description — optional */}
      <div>
        <label className={labelClass}>Description</label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Briefly describe the property (optional)"
          className="min-h-[80px]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2 xl:pt-4">
        <Button type="submit" disabled={!isValid}>
          Next: Upload Documents →
        </Button>
      </div>
    </form>
  );
}
