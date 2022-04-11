import { Ref } from "@yuuza/webfx";
import React from "react";
import { ActivityName } from "./activities";

export const navContext = React.createContext<Ref<ActivityName>>(null!);
