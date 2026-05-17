import { t } from '@lingui/core/macro';
import {
  Alert,
  Card,
  Center,
  Divider,
  Loader,
  Text,
  Button
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import DashboardMenu from './DashboardMenu';
import DashboardWidget from './DashboardWidget';
import DashboardWidgetDrawer from './DashboardWidgetDrawer';

const ReactGridLayout = WidthProvider(Responsive);

export default function DashboardLayout() {
  const [layouts, setLayouts] = useState({});
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(true); // simplified

  const [editing, setEditing] = useDisclosure(false);
  const [removing, setRemoving] = useDisclosure(false);

  const [
    widgetDrawerOpened,
    { open: openWidgetDrawer, close: closeWidgetDrawer }
  ] = useDisclosure(false);

  const widgetLabels = widgets.map((w) => w.label);

  const addWidget = (widget: any) => {
    setWidgets([...widgets, widget]);
  };

  const removeWidget = (label: string) => {
    setWidgets(widgets.filter((w) => w.label !== label));
  };

  const clearWidgets = () => {
    setWidgets([]);
    setLayouts({});
  };

  return (
    <>
      {/* 🔷 HEADER */}
      <Card
        shadow="sm"
        p="xl"
        radius="md"
        mb="md"
        style={{ backgroundColor: '#0f766e', color: 'white' }}
      >
        <Center style={{ flexDirection: 'column' }}>
          <Text size="xl" fw={700}>SH Health Global</Text>
          <Text size="sm" fw={500} style={{ color: '#ccfbf1' }}>
            StayingHealthy & Wellbeing — Clinical Intelligence Simplified
          </Text>
        </Center>
      </Card>

      {/* 🤖 AI ENTRY */}
      <Card
        shadow="xs"
        p="lg"
        radius="md"
        mb="md"
        withBorder
        style={{ textAlign: 'center' }}
      >
        <Text fw={600}>Have a health question?</Text>

        <Text size="sm" c="dimmed" mt="xs">
          Get instant guidance on hypertension, diabetes, and medications.
        </Text>

        <Button
          fullWidth
          radius="xl"
          mt="md"
          style={{ backgroundColor: '#0d9488' }}
          onClick={() => window.location.href = '/ai'}
        >
          🤖 Ask AI Health Assistant
        </Button>
      </Card>

      {/* ⚙️ CONTROLS */}
      <DashboardWidgetDrawer
        opened={widgetDrawerOpened}
        onClose={closeWidgetDrawer}
        onAddWidget={addWidget}
        currentWidgets={widgetLabels}
      />

      <DashboardMenu
        onAddWidget={openWidgetDrawer}
        onStartEdit={setEditing.open}
        onClear={clearWidgets}
        onStartRemove={setRemoving.open}
        onAcceptLayout={() => {
          setEditing.close();
          setRemoving.close();
        }}
        editing={editing}
        removing={removing}
      />

      <Divider my="sm" />

      {/* 🧠 CLINICAL INFO */}
      <Alert
        icon={<IconInfoCircle size="1rem" />}
        title="Clinical Insight"
        color="teal"
        variant="outline"
        mb="md"
      >
        <Text size="sm">
          Led by <b>Senior Pharmacist Yihanew Bazezew (MBA)</b> —
          translating 19 years of clinical expertise into simple, practical care.
        </Text>
      </Alert>

      {/* 📊 DASHBOARD */}
      {loaded ? (
        widgetLabels.length === 0 ? (
          <Center>
            <Card p="xl" withBorder>
              <Alert title={t`Welcome to your Health Hub`} color="blue">
                <Text>
                  {t`Add widgets for Hypertension, Diabetes, and Healthy Habits.`}
                </Text>
              </Alert>
            </Card>
          </Center>
        ) : (
          <ReactGridLayout
            layouts={layouts}
            cols={{ lg: 12 }}
            rowHeight={64}
            isDraggable={editing}
            isResizable={editing}
          >
            {widgets.map((item) =>
              DashboardWidget({
                item,
                editing,
                removing,
                onRemove: () => removeWidget(item.label)
              })
            )}
          </ReactGridLayout>
        )
      ) : (
        <Center>
          <Loader />
        </Center>
      )}
    </>
  );
}
