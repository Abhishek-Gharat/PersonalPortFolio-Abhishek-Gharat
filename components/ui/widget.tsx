import * as React from "react";
import { cn } from "../../lib/utils";

const Widget = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border bg-card text-card-foreground shadow-xl",
      className
    )}
    {...props}
  />
));
Widget.displayName = "Widget";

const WidgetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex p-5", className)} {...props} />
));
WidgetContent.displayName = "WidgetContent";

const WidgetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold tracking-tight", className)}
    {...props}
  />
));
WidgetTitle.displayName = "WidgetTitle";

export { Widget, WidgetContent, WidgetTitle };
