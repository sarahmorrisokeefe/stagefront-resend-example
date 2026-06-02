import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// SERVER-ONLY. @react-pdf/renderer must never reach a client bundle.
// Only import this from route handlers.

export interface TicketData {
  showName: string;
  fanName: string;
  venue: string;
  date: string; // human-formatted, e.g. "Fri, Jul 18 2026"
  ticketNumber: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0a0a0a",
    color: "#ffffff",
    padding: 32,
    fontFamily: "Helvetica",
  },
  frame: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#333333",
    borderStyle: "solid",
    padding: 32,
    justifyContent: "space-between",
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 4,
    color: "#e8c96a",
    textTransform: "uppercase",
  },
  showName: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    lineHeight: 1.1,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    borderBottomStyle: "solid",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    width: 90,
    fontSize: 9,
    letterSpacing: 2,
    color: "#888888",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    color: "#ffffff",
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#888888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  ticketNumber: {
    fontSize: 16,
    fontFamily: "Courier-Bold",
    color: "#e8c96a",
  },
  brand: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#888888",
    textTransform: "uppercase",
  },
});

function TicketDocument({ data }: { data: TicketData }) {
  return (
    <Document
      title={`Stagefront ticket — ${data.showName}`}
      author="Stagefront"
    >
      {/* Fixed ticket-sized canvas + wrap={false} so the ticket is always
          exactly one page and never paginates on overflow. */}
      <Page size={[620, 400]} wrap={false} style={styles.page}>
        <View style={styles.frame}>
          <View>
            <Text style={styles.kicker}>Admit one</Text>
            <Text style={styles.showName}>{data.showName}</Text>
          </View>

          <View style={styles.rule} />

          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{data.fanName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Venue</Text>
              <Text style={styles.value}>{data.venue}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{data.date}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Ticket no.</Text>
              <Text style={styles.ticketNumber}>{data.ticketNumber}</Text>
            </View>
            <Text style={styles.brand}>Stagefront</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

/** Render a ticket PDF to a Buffer suitable for a Resend attachment. */
export async function renderTicketPdf(data: TicketData): Promise<Buffer> {
  return renderToBuffer(<TicketDocument data={data} />);
}
