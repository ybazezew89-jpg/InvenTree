return (
  <>
    {/* 🔷 1. HEADER (Brand Identity) */}
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

    {/* 🤖 2. AI ENTRY (MOST IMPORTANT ADDITION) */}
    <Card
      shadow="xs"
      p="lg"
      radius="md"
      mb="md"
      withBorder
      style={{ textAlign: 'center' }}
    >
      <Text fw={600} size="md">Have a health question?</Text>

      <Text size="sm" color="dimmed" mt="xs">
        Get instant guidance on hypertension, diabetes, medications, and more.
      </Text>

      <button
        style={{
          marginTop: '15px',
          backgroundColor: '#0d9488',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          cursor: 'pointer',
          fontWeight: 600
        }}
        onClick={() => window.location.href = '/ai'} // or your AI route
      >
        🤖 Ask AI Health Assistant
      </button>
    </Card>

    {/* ⚙️ 3. SYSTEM COMPONENTS */}
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

    <Divider p="xs" />

    {/* 🧠 4. CLINICAL AUTHORITY */}
    <Alert
      icon={<IconInfoCircle size="1rem" />}
      title="Clinical Insight"
      color="teal"
      variant="outline"
      mb="lg"
    >
      <Text size="sm">
        Led by <b>Senior Pharmacist Yihanew Bazezew (MBA)</b>, transforming
        19 years of clinical expertise into clear, practical "Simple Talk"
        guidance for chronic disease management.
      </Text>
    </Alert>

    {/* 📊 5. DASHBOARD CONTENT */}
    {loaded ? (
      widgetLabels.length === 0 ? (
        <Center>
          <Card padding="xl" withBorder>
            <Alert color="blue" title={t`Welcome to your Health Hub`}>
              <Text>
                {t`Add trackers for Hypertension, Diabetes, and Healthy Habits.`}
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
          {widgets.map(item =>
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
