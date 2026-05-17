<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />


<meta name="description" content="SH Health Global: Clinical intelligence simplified. Built on 19 years of pharmacy expertise for NCD management." />
<meta name="theme-color" content="#0f766e" />


<title>SH Health Global | Clinical Intelligence Simplified</title>


<style>
:root {
--primary-teal: #0f766e;
--light-teal: #f0fdfa;
--accent-teal: #0d9488;
}

setWidgets((prev) => [...prev, newWidget]);

      // Update the layouts to include the new widget.
      // We pass the updated widget list directly to ensure the layout 
      // engine recognizes the new addition immediately.
      const _layouts: any = { ...layouts };
      const updatedWidgets = [...widgets, newWidget];

      Object.keys(_layouts).forEach((key) => {
        _layouts[key] = updateLayoutForWidget(_layouts[key], updatedWidgets, false);
      });

      setLayouts(_layouts);
    },
    [availableWidgets.items, widgets, layouts, updateLayoutForWidget]
  );

  /**
   * Callback function to remove a widget from the dashboard
   */
  const removeWidget = useCallback(
    (widgetLabel: string) => {
      // Remove the widget from the list using functional update for stability
      setWidgets((prev) => prev.filter((item) => item.label !== widgetLabel));

      // Remove the widget from the grid layout state
      const _layouts: any = { ...layouts };

      Object.keys(_layouts).forEach((key) => {
        _layouts[key] = _layouts[key].filter(
          (item: Layout) => item.i !== widgetLabel
        );
      });

      setLayouts(_layouts);
    },
    [layouts]
  );

  /**
   * Ensures widget constraints (minWidth/minHeight) are respected
   */
  const updateLayoutForWidget = useCallback(
    (layout: any[], widgets: any[], overrideSize: boolean) => {
      return layout.map((item: Layout): Layout => {
        // Find the matching widget to check its specific constraints
        const widget = widgets.find(
          (w: DashboardWidgetProps) => w.label === item.i
        );

        const minH = widget?.minHeight ?? 2;
        const minW = widget?.minWidth ?? 1;

        let w = Math.max(item.w ?? 1, minW);
        let h = Math.max(item.h ?? 1, minH);

        if (overrideSize) {
          w = minW;
          h = minH;
        }

        return {
          ...item,
          w,
          h,
          minH,
          minW
        };
      });
    },
    []
  );


body {
background-color: var(--light-teal);
color: #1e293b;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
margin: 0;
padding: 20px;
line-height: 1.6;
}



return {
          ...item,
          w,
          h,
          minH,
          minW
        };
      });
    },
    []
  );

  // Rebuild layout whenever the widget selection changes
  useEffect(() => {
    onLayoutChange({}, layouts);
  }, [widgets]);

  /**
   * Processes layout changes and syncs them with remote/local storage
   */
  const onLayoutChange = useCallback(
    (layout: any, newLayouts: any) => {
      // Reconstruct layouts based on the widget constraints (minW/minH)
      Object.keys(newLayouts).forEach((key) => {
        newLayouts[key] = updateLayoutForWidget(
          newLayouts[key],
          widgets,
          false
        );
      });

      // Only save if the app is fully loaded and data is available
      if (loaded && availableWidgets.loaded) {
        const reducedLayouts: any = {};

        // Sanitize layouts: save only necessary placement data to storage
        Object.keys(newLayouts).forEach((key) => {
          reducedLayouts[key] = newLayouts[key].map((item: Layout) => ({
            ...item,
            moved: item.moved ? true : undefined,
            static: item.static ? true : undefined
          }));
        });

        setRemoteLayouts(reducedLayouts);
        setLayouts(newLayouts);
      }
    },
    [loaded, widgets, availableWidgets.loaded, updateLayoutForWidget, setRemoteLayouts]
  );

  /**
   * Initial Hydration: Load dashboard state from storage once widgets are ready
   */
  useEffect(() => {
    if (availableWidgets.loaded && !loaded) {
      setLayouts(remoteLayouts || {});
      setWidgets(
        availableWidgets.items.filter((widget) =>
          remoteWidgets.includes(widget.label)
        )
      );

      setLoaded(true);
    }
  }, [availableWidgets.loaded, availableWidgets.items, remoteLayouts, remoteWidgets, loaded]);

.container {
background: white;
max-width: 600px;
margin: 20px auto;
padding: 30px;
border-radius: 15px;
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
border-top: 8px solid var(--primary-teal);
overflow: hidden;
}



/**
   * Clear all widgets from the dashboard
   */
  const clearWidgets = useCallback(() => {
    // If the sample dashboard is active, toggle it off
    if (showSampleDashboard) {
      setShowSampleDashboard(false);
    }
    
    // Reset state to empty values
    setWidgets([]);
    setLayouts({});
  }, [showSampleDashboard, setShowSampleDashboard]);

header {
text-align: center;
background-color: var(--primary-teal);
padding: 40px 20px;
border-radius: 10px 10px 0 0;
margin: -30px -30px 30px -30px;
color: white;
}


if (user.isSuperuser()) {
      // Superuser can also view the "news" widget
      layouts.push({
        w: 6,
        h: 4,
        x: 6,
        y: 0,
        i: 'news',
        minW: 5,
        minH: 4,
        moved: false,
        static: false
      });
    }

    return {
      lg: layouts
    };
  }, [user]);

  const loadWigs = ['news', 'gstart'];

  const defaultWidgets = useMemo(() => {
    return loadWigs
      .map((lwid: string) =>
        availableWidgets.items.find((wid) => wid.label === lwid)
      )
      .filter((widget): widget is DashboardWidgetProps => widget !== undefined);
  }, [availableWidgets.items]);


.ai-bridge {
text-align: center;
margin: 30px 0;
padding: 20px;
background-color: #fff;
border: 2px solid #ccfbf1;
border-radius: 12px;
}





.ai-button {
display: inline-flex;
align-items: center;
gap: 12px;
background-color: var(--accent-teal);
color: white;
padding: 18px 32px;
font-size: 1.2rem;
font-weight: bold;
border-radius: 50px;
text-decoration: none;
box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
transition: transform 0.2s ease;
}


.ai-button:hover {
transform: scale(1.05);
background-color: var(--primary-teal);
}


.clinical-section {
margin-bottom: 25px;
padding: 15px;
background-color: var(--light-teal);
border-left: 4px solid var(--primary-teal);
border-radius: 0 8px 8px 0;
}


h2, h3 { color: var(--primary-teal); margin-top: 0; }
ul { padding-left: 20px; }
li { margin-bottom: 8px; }


.footer-note {
text-align: center;
font-size: 0.85rem;
color: #64748b;
margin-top: 40px;
border-top: 1px solid #e2e8f0;
padding-top: 20px;
}
</style>
</head>


<body>


<div class="container">


<header>
<h1 style="margin: 0; font-size: 1.8rem;">SH Health Global</h1>
<p style="color: #ccfbf1; font-weight: bold; margin-top: 10px; opacity: 0.9;">
StayingHealthy & Wellbeing — Clinical Intelligence Simplified
</p>
</header>


<div class="ai-bridge">
<h3 style="margin-bottom: 15px;">Personalized Health Support</h3>
<p style="font-size: 0.95rem; color: #475569; margin-bottom: 20px;">
Chat with our AI-Based Assistant for evidence-based guidance on your medications and chronic conditions.
</p>


<a href="https://sh-health-platform.vercel.app" target="_blank" class="ai-button">
🤖 Ask AI Assistant
</a>


<p style="font-size: 0.8rem; color: #94a3b8; margin-top: 15px;">
Voice-Enabled • Pharmacy-Led Guidance • Privacy First
</p>
</div>


<section style="margin-bottom: 30px;">
<h2>About SH Health</h2>
<p>
Led by <strong>Senior Pharmacist Yihanew Bazezew (MBA)</strong>, this ecosystem transforms 19 years of clinical expertise into accessible "Simple Talk" for non-communicable disease (NCD) management.
</p>
</section>


<div class="clinical-section">
<h3>🫀 Hypertension (High BP)</h3>
<p>Think of blood pressure like water in a hose. If the pressure is too high for too long, it damages the heart and kidneys. Reducing salt is your first line of defense.</p>
</div>


<div class="clinical-section">
<h3>🩸 Diabetes Care</h3>
<p>Managing diabetes is about keeping blood sugar stable. Consistency in medication and "Carb-Swapping" are key to preventing long-term complications.</p>
</div>


<section>
<h3>Healthy Lifestyle Pillars</h3>
<ul>
<li><strong>Salt Reduction:</strong> Aim for less than 1 teaspoon daily.</li>
<li><strong>Active Movement:</strong> 30 minutes of brisk walking.</li>
<li><strong>Hydration:</strong> Choose clean water over sugary drinks.</li>
<li><strong>Medication Adherence:</strong> Take doses at the same time daily.</li>
</ul>
</section>


<section style="margin-top: 30px; font-size: 0.85rem; color: #64748b; background: #f8fafc; padding: 15px; border-radius: 8px;">
<p><strong>⚠️ Medical Disclaimer:</strong> This platform is for educational health literacy. It is not a substitute for professional medical diagnosis or treatment. Always consult your healthcare provider.</p>
</section>


<div class="footer-note">
© 2026 SH Health Platform — Empowering Patients through Clinical Intelligence
</div>


</div>


</body>
</html>
