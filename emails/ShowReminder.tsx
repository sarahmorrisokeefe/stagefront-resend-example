import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";
import { LOGOMARK_URL } from "@/lib/site-url";

export interface ShowReminderProps {
  fanName: string;
  showName: string;
  venue: string;
}

export default function ShowReminder({
  fanName,
  showName,
  venue,
}: ShowReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Heads up — ${showName} at ${venue} is tomorrow night. Keep your PDF ticket handy and we'll see you there.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Img
            src={LOGOMARK_URL}
            width="52"
            height="32"
            alt="Stagefront"
            style={logo}
          />
          <Text style={kicker}>TOMORROW NIGHT</Text>
          <Text style={headline}>
            Hey {fanName}, {showName} is tomorrow at {venue}.
          </Text>
          <Text style={sub}>
            Doors are sooner than you think. Keep your ticket handy — it&apos;s
            the PDF we sent with your confirmation.
          </Text>
          <Text style={brand}>STAGEFRONT</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  fontFamily: "Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "24px 16px",
};

const container: React.CSSProperties = {
  maxWidth: "440px",
  margin: "0 auto",
  padding: "36px",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: "6px",
};

const logo: React.CSSProperties = {
  display: "block",
  marginBottom: "20px",
};

const kicker: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "4px",
  color: "#4A7FEA",
  margin: "0 0 12px",
};

const headline: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: 1.3,
  color: "#ffffff",
  margin: "0 0 16px",
};

const sub: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.6,
  color: "#bbbbbb",
  margin: "0",
};

const brand: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "3px",
  color: "#888888",
  margin: "40px 0 0",
};
