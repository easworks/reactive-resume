import { zodResolver } from "@hookform/resolvers/zod";
import { t, Trans } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { registerSchema } from "@reactive-resume/dto";
import { usePasswordToggle } from "@reactive-resume/hooks";
import {
  Alert,
  AlertTitle,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { useEasRegister } from "@/client/services/auth";
import { useFeatureFlags } from "@/client/services/feature";

type FormValues = z.infer<typeof registerSchema>;

export const EasRegisterPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const { easRegister, loading } = useEasRegister();
  // const [data, setData] = useState<DataType>();

  useEffect(() => {
    const callback = async () => {
      const name = params.get("displayName");
      const email = params.get("email");

      if (name && email) {
        console.log("Hi there");
        try {
          await easRegister({
            name,
            email,
            username: email.split("@")[0],
            locale: "en-US",
            password: "27fksjfgkjsfkj",
          });
          navigate("/", {
            replace: true,
          });
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    callback();
  }, []);

  return <div></div>;
};
