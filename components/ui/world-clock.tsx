"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Widget, WidgetContent, WidgetTitle } from "./widget";
import { Separator } from "./separator";
import { Label } from "./label";

function useTimeInZone(timeZone: string) {
  const [now, setNow] = React.useState(() => new Date());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(now);
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone,
    }).format(now)
  );

  return { time, isDay: hour >= 6 && hour < 18, mounted };
}

function ZoneRow({ city, timeZone }: { city: string; timeZone: string }) {
  const { time, isDay, mounted } = useTimeInZone(timeZone);
  // Deterministic pre-mount icon (server and first client render agree);
  // the live text below carries suppressHydrationWarning instead so it
  // never flashes a placeholder.
  const Icon = !mounted || isDay ? SunIcon : MoonIcon;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <Label>{city}</Label>
        <Icon className="h-5 w-5" />
      </div>
      <WidgetTitle suppressHydrationWarning className="text-lg tabular-nums">{time}</WidgetTitle>
    </div>
  );
}

export function WorldClockWidget() {
  return (
    <Widget>
      <WidgetContent className="flex-col justify-between gap-2 p-4">
        <ZoneRow city="Mumbai" timeZone="Asia/Kolkata" />
        <Separator />
        <ZoneRow city="Vancouver" timeZone="America/Vancouver" />
      </WidgetContent>
    </Widget>
  );
}

export default WorldClockWidget;
