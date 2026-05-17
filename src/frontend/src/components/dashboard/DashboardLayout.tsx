import { t } from '@lingui/core/macro';
import {
  Alert, Card, Center, Divider, Loader, Space, Text, Button, Stack
} from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconExclamationCircle, IconInfoCircle, IconRobot } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useShallow } from 'zustand/react/shallow';

import { useDashboardItems } from '../../hooks/UseDashboardItems';
import { useLocalState } from '../../states/LocalState';
import { useUserState } from '../../states/UserState';

import DashboardMenu from './DashboardMenu';
import DashboardWidget, { type DashboardWidgetProps } from './DashboardWidget';
import DashboardWidgetDrawer from './DashboardWidgetDrawer';

const ReactGridLayout = WidthProvider(Responsive);

export default function DashboardLayout() {
  const user = useUserState();
  const [layouts, setLayouts] = useState({});
  const [widgets, setWidgets] = useState<DashboardWidgetProps[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [
    remoteWidgets, setRemoteWidgets,
    remoteLayouts, setRemoteLayouts,
    showSampleDashboard, setShowSampleDashboard
  ] = useLocalState(
    useShallow((state) => [
      state.widgets, state.setWidgets,
      state.layouts, state.setLayouts,
      state.showSampleDashboard, state.setShowSampleDashboard
    ])
  );

  const [editing, setEditing] = useDisclosure(false);
  const [removing, setRemoving] = useDisclosure(false);
  const [widgetDrawerOpened, { open: openWidgetDrawer, close: closeWidgetDrawer }] = useDisclosure(false);

  useHotkeys([['mod+E', () => setEditing.toggle()]]);
  const availableWidgets = useDashboardItems();

  const widgetLabels = useMemo(() => widgets.map((w) => w.label), [widgets]);

  // Sync selection to storage
  useEffect(() => {
    if (loaded) setRemoteWidgets(widgetLabels);
  }, [widgetLabels, loaded, setRemoteWidgets]);

  const updateLayoutForWidget = useCallback((layout: any[], currentWidgets: any[], overrideSize: boolean) => {
    return layout.map((item: Layout): Layout => {
      const widget = currentWidgets.find((w: DashboardWidgetProps) => w.label === item.i);
      const minH = widget?.minHeight ?? 2;
      const minW = widget?.minWidth ?? 1;

      return {
        ...item,
        w: overrideSize ? minW : Math.max(item.w ?? 1, minW),
        h: overrideSize ? minH : Math.max(item.h ?? 1, minH),
        minH,
        minW
      };
    });
  }, []);

  const addWidget = useCallback((label: string) => {
    const newWidget = availableWidgets.items.find((wid) => wid.label === label);
    if (newWidget) {
      if (showSampleDashboard) setShowSampleDashboard(false);
      
      setWidgets((prev) => {
        const updated = [...prev, newWidget];
        const nextLayouts = { ...layouts };
        Object.keys(nextLayouts).forEach((key) => {
          nextLayouts[key] = updateLayoutForWidget(nextLayouts[key] || [], updated, false);
        });
        setLayouts(nextLayouts);
        return updated;
      });
    }
  }, [availableWidgets.items, showSampleDashboard, setShowSampleDashboard, layouts, updateLayoutForWidget]);

  const removeWidget = useCallback((label: string) => {
    setWidgets((prev) => prev.filter((w) => w.label !== label));
    setLayouts((prevLayouts: any) => {
      const next = { ...prevLayouts };
      Object.keys(next).forEach((key) => {
        next[key] = next[key].filter((item: Layout) => item.i !== label);
      });
      return next;
    });
  }, []);

  const onLayoutChange = useCallback((_current: any, newLayouts: any) => {
    if (loaded && availableWidgets.loaded) {
      const sanitized: any = {};
      Object.keys(newLayouts).forEach((key) => {
        sanitized[key] = newLayouts[key].map((item: Layout) => ({
          ...item,
          moved: item.moved || undefined,
          static: item.static || undefined
        }));
      });
      setRemoteLayouts(sanitized);
      setLayouts(newLayouts);
    }
  }, [loaded, availableWidgets.loaded, setRemoteLayouts]);

  useEffect(() => {
    if (availableWidgets.loaded && !loaded) {
      setLayouts(remoteLayouts || {});
      setWidgets(availableWidgets.items.filter((w) => remoteWidgets.includes(w.label)));
      setLoaded(true);
    }
  }, [availableWidgets.loaded, availableWidgets.items, remoteLayouts, remoteWidgets, loaded]);

  const clearWidgets = useCallback(() => {
    if (showSampleDashboard) setShowSampleDashboard(false);
    setWidgets([]);
    setLayouts({});
  }, [showSampleDashboard, setShowSampleDashboard]);

  const defaultLayouts = useMemo(() => {
    const base = [{ w: 6, h: 4, x: 0, y: 0, i: 'gstart', minW: 5, minH: 4 }];
    if (user.isSuperuser()) base.push({ w: 6, h: 4, x: 6, y: 0, i: 'news', minW: 5, minH: 4 });
    return { lg: base };
  }, [user]);

  const defaultWidgets = useMemo(() => {
    const labels = ['news', 'gstart'];
    return availableWidgets.items.filter((w) => labels.includes(w.label));
  }, [availableWidgets.items]);

  return (
    <Stack gap="md">
      {/* Brand Header */}
      <Card shadow="sm" p="xl" radius="md" style={{ backgroundColor: '#0f766e', color: 'white' }}>
        <Center style={{ flexDirection: 'column' }}>
          <Text size="xl" fw={700}>SH Health Global</Text>
          <Text size="sm" opacity={0.8}>Clinical Intelligence Simplified</Text>
        </Center>
      </Card>

      {/* AI Assistant CTA */}
      <Card withBorder shadow="xs" p="lg" radius="md" style={{ textAlign: 'center' }}>
        <Text fw={600}>Need clinical guidance?</Text>
        <Button 
          leftSection={<IconRobot size={20} />} 
          mt="md" color="teal" radius="xl" 
          onClick={() => window.open('https://sh-health-platform.vercel.app', '_blank')}
        >
          Ask AI Health Assistant
        </Button>
      </Card>

      <DashboardWidgetDrawer opened={widgetDrawerOpened} onClose={closeWidgetDrawer} onAddWidget={addWidget} currentWidgets={widgetLabels} />
      
      <DashboardMenu 
        onAddWidget={openWidgetDrawer} onStartEdit={setEditing.open} onClear={clearWidgets} 
        onStartRemove={setRemoving.open} onAcceptLayout={() => { setEditing.close(); setRemoving.close(); }} 
        editing={editing} removing={removing} 
      />

      <Divider />

      {availableWidgets.error && <Alert color="red" icon={<IconExclamationCircle />}>{t`Error loading widgets`}</Alert>}

      {loaded ? (
        widgetLabels.length === 0 && !showSampleDashboard ? (
          <Alert icon={<IconInfoCircle />}>{t`Add widgets to track your health data.`}</Alert>
        ) : (
          <ReactGridLayout
            className="layout"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={64}
            layouts={showSampleDashboard ? defaultLayouts : layouts}
            onLayoutChange={onLayoutChange}
            isDraggable={editing}
            isResizable={editing}
          >
            {(showSampleDashboard ? defaultWidgets : widgets).map((w) => (
              <div key={w.label}>
                <DashboardWidget item={w} editing={editing} removing={removing} onRemove={() => removeWidget(w.label)} />
              </div>
            ))}
          </ReactGridLayout>
        )
      ) : (
        <Center h={200}><Loader color="teal" /></Center>
      )}
    </Stack>
  );
}
