import * as React from "react";

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlValue?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, htmlValue, ...props }, ref) => {
    return (
      <label
        className={
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" +
            (className ? " " + className : "")
        }
        htmlFor={htmlValue}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";

export { Label };