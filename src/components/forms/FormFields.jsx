import React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Calendar,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge
} from '../ui/index';
import { format } from 'date-fns';

/**
 * Date picker form field
 * 
 * @param {Object} props
 * @param {Object} props.form - React Hook Form's form object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {Object} props.validation - Validation rules (optional)
 */
export const DatePickerField = ({ 
  form, 
  name, 
  label, 
  validation = {} 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className="w-full pl-3 text-left font-normal"
                >
                  {field.value ? format(field.value, "PP") : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Text input form field
 * 
 * @param {Object} props
 * @param {Object} props.form - React Hook Form's form object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.type - Input type (default: text)
 * @param {Object} props.validation - Validation rules (optional)
 */
export const InputField = ({
  form,
  name,
  label,
  placeholder = '',
  type = 'text',
  validation = {}
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type} 
              placeholder={placeholder} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Textarea form field
 * 
 * @param {Object} props
 * @param {Object} props.form - React Hook Form's form object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.validation - Validation rules (optional)
 */
export const TextareaField = ({
  form,
  name,
  label,
  placeholder = '',
  validation = {}
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={placeholder} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Select field
 * 
 * @param {Object} props
 * @param {Object} props.form - React Hook Form's form object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {Array} props.options - Select options [{value, label}]
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.validation - Validation rules (optional)
 */
export const SelectField = ({
  form,
  name,
  label,
  options = [],
  placeholder = 'Select an option',
  validation = {}
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Badge select field - for multi-select with badges
 * 
 * @param {Object} props
 * @param {Object} props.form - React Hook Form's form object
 * @param {string} props.name - Field name
 * @param {string} props.label - Field label
 * @param {Array} props.options - Options array of objects with id, name, color
 * @param {Object} props.validation - Validation rules (optional)
 */
export const BadgeSelectField = ({
  form,
  name,
  label,
  options = [],
  validation = {}
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map(option => (
              <Badge
                key={option.id}
                variant={field.value?.includes(option.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={{
                  backgroundColor: field.value?.includes(option.id) ? option.color : 'transparent',
                  borderColor: option.color,
                  color: field.value?.includes(option.id) ? 'white' : undefined
                }}
                onClick={() => {
                  const newValue = field.value?.includes(option.id)
                    ? field.value.filter(id => id !== option.id)
                    : [...(field.value || []), option.id];
                  field.onChange(newValue);
                }}
              >
                {option.name}
              </Badge>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
