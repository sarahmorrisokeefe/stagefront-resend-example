import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

export interface TicketConfirmationProps {
  fanName: string;
  showName: string;
  venue: string;
  date: string;
  ticketNumber: string;
}

export default function TicketConfirmation({
  fanName,
  showName,
  venue,
  date,
  ticketNumber,
}: TicketConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your ticket for ${showName} at ${venue} on ${date} is confirmed — PDF attached. See you down front.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={kicker}>ADMIT ONE</Text>
          <Text style={showNameStyle}>{showName}</Text>

          <Hr style={rule} />

          <Section>
            <Row style={metaRow}>
              <Column style={labelCol}>NAME</Column>
              <Column style={valueCol}>{fanName}</Column>
            </Row>
            <Row style={metaRow}>
              <Column style={labelCol}>VENUE</Column>
              <Column style={valueCol}>{venue}</Column>
            </Row>
            <Row style={metaRow}>
              <Column style={labelCol}>DATE</Column>
              <Column style={valueCol}>{date}</Column>
            </Row>
            <Row style={metaRow}>
              <Column style={labelCol}>TICKET</Column>
              <Column style={ticketCol}>{ticketNumber}</Column>
            </Row>
          </Section>

          <Hr style={rule} />

          <Text style={note}>
            Your ticket is attached as a PDF. Bring it to the door — on your
            phone or printed, either works.
          </Text>

          <Text style={signoff}>See you down front.</Text>
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

// A slightly lighter surface than the page so the ticket reads as a
// deliberate card, not a thin border floating in an undifferentiated void.
const container: React.CSSProperties = {
  maxWidth: "440px",
  margin: "0 auto",
  padding: "36px",
  backgroundColor: "#141414",
  border: "1px solid #2a2a2a",
  borderRadius: "6px",
};

const kicker: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "4px",
  color: "#4A7FEA",
  margin: "0 0 8px",
};

const showNameStyle: React.CSSProperties = {
  fontSize: "34px",
  fontWeight: "bold",
  lineHeight: 1.1,
  margin: "0",
  color: "#ffffff",
};

const rule: React.CSSProperties = {
  borderColor: "#2a2a2a",
  margin: "28px 0",
};

const metaRow: React.CSSProperties = {
  marginBottom: "14px",
};

const labelCol: React.CSSProperties = {
  width: "80px",
  fontSize: "10px",
  letterSpacing: "2px",
  color: "#888888",
  verticalAlign: "top",
};

const valueCol: React.CSSProperties = {
  fontSize: "15px",
  color: "#ffffff",
};

const ticketCol: React.CSSProperties = {
  fontSize: "15px",
  fontFamily: "Courier, monospace",
  color: "#4A7FEA",
};

const note: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: 1.6,
  color: "#bbbbbb",
  margin: "0",
};

const signoff: React.CSSProperties = {
  fontSize: "14px",
  color: "#ffffff",
  margin: "24px 0 0",
};

const brand: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "3px",
  color: "#888888",
  margin: "32px 0 0",
};
